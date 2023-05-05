#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import moment from 'moment';
import { argv, fs, $, path } from 'zx';
import { parse } from 'yaml';
import { connect } from '../lib/mongodb.mjs';
import hash from '../lib/id.mjs';

if (!argv.source && !argv.name) {
  console.log("Missing --name or --source");
  console.log("--name is the field 'campaign' in (db.gdpro.campaings)");
  console.log("--source is a YAML file in input/; check README.md");
  console.log("p.s. --sessions <number>");
  process.exit(1);
}

if (!argv.sessions) {
  console.log("--session 5 by default is assumed!");
}
if (!argv.consent){
  console.log("--consent false by default is assumed")
}
const sessions = argv?.sessions || 5;
const consent = argv?.consent || false;
const start = moment();

const bannerLevel = !!argv.consent ? 'banner1' : 'banner0';

/* this script execute in sequence:
 * 1) wec
 * 2) produce a unique ID so every website can have only one entry per day in the DB
 * 3) acquire the produced output of wec into mongodb */

const wec = !!argv.consent ? 
  `./scripts/wec-clicker.mjs` :
  `./website-evidence-collector/bin/website-evidence-collector.js`;
const acquirer = `./scripts/internal/mongosave.mjs`;

const { name, fullList } = await acquireSource(argv.source, argv.name);

/* now remove the duplicates, because the session parallel might fall into 
 * a race condition if a session terminates before the other have begun */
const data = {};
for (const index of _.keys(fullList)) {
  if(!await analysisIsPresent(fullList[index]))
    _.set(data, index, fullList[index]);
}

console.log(`From a full source of ${_.keys(fullList).length} sites, still TOBEDONE ${_.keys(data).length}`);

if(!_.keys(data).length) {
  console.log(`.. seems the job here is done for today! no need to re-run it`);
  process.exit(1);
}

/* here parallelization starts */
const seconds = _.parseInt(argv?.seconds) || 3;
const chunksN = _.round(_.keys(data).length / sessions) || 5;
console.log(`Dividing ${_.keys(data).length} in ${chunksN} because of ${sessions} sessions; Spin new each ${seconds} seconds`);
const chunks = _.chunk(_.keys(data), chunksN);
let sessionActive = 0;

setInterval(async () => {

  if(chunks.length) {
    const batch = chunks.pop();
    sessionActive++;
    console.log(`[+] Session ${sessionActive}/${chunks.length} picked a batch of ${batch.length} sites, still to get ${chunks.length} chunks`);
    for (const index of batch) {
      console.log(`  ++ site ${index}, starting ${data[index].title}`);
      await processURL(index);
    }
    console.log(`Session completed ${sessionActive} decrements`);
    sessionActive--;
  }

}, seconds * 1000);

setInterval(async () => {
  console.log("                     ", new Date());
  console.log("                     ", sessionActive, "sessions active");
  const difference = moment.duration(moment() - start);
  if(!sessionActive) {
    console.log(`Process completed in ${difference.humanize()}`)
    process.exit(0);
  }
}, 10000)

async function acquireSource(source, name) {

  if(source) {
    const data = parse(await fs.readFile(argv.source, 'utf-8'));
    console.log(`With ${source} we picked ${data.length} sites`);
    const c = argv.source.split('/').pop();
    return {
      name: c.replace(/\.yaml/, ''),
      fullList: data
  }
  } else {
    const { mongodb } = (await fs.readJSON('./config/database.json'));
    const client = await connect(mongodb);
    const data = await client.db().collection("campaigns").find({campaign: name}).toArray();
    console.log(`With ${name} we picked ${data.length} sites`);
    await client.close();
    return {
      name,
      fullList: data
    }
  }
}

async function ensureDirectory(hostname) {
  const day = new Date().toISOString().substring(0, 10);
  const bannerdir = path.join('output', bannerLevel, day, hostname);
  await fs.ensureDir(bannerdir);
  return { day, bannerdir }
}

async function analysisIsPresent(info) {
  /* this code was duplicated and we paid already once! -- sorry Zaizen! */
  let hostname = null;
  try {
    const urlo = new URL(info.site);
    hostname = urlo.hostname;
  } catch(error) {
    console.log(`Invalid URL? (${info.site}) ${error.message}`);
    console.log(JSON.stringify(info, undefined, 2));
    return;
  }

  const { day, bannerdir } = await ensureDirectory(hostname);
  const inspection = path.join(bannerdir, 'inspection.json');
  return !!fs.existsSync(inspection);
}

async function processURL(title) {
  /* info would also be passed to `acquire` and would become part of the DB */
  const info = data[title];
  info.name = title;

  let hostname = null;
  try {
    const urlo = new URL(info.site);
    hostname = urlo.hostname;
  } catch(error) {
    console.log(`Invalid URL? (${info.site}) ${error.message}`);
    console.log(JSON.stringify(info, undefined, 2));
    return;
  }

  const { day, bannerdir } = await ensureDirectory(hostname);

  const inspection = path.join(bannerdir, 'inspection.json');
  if(fs.existsSync(inspection)) {
    console.log(`File ${inspection} is present, skipping!`);
    return;
  }

  try {
    const poutput = await $`${wec} ${info.site} --page-timeout 30000 --overwrite --output ${bannerdir} --consent ${consent}`.quiet();
    const logfile = path.join(bannerdir, 'stdout.log');
    const errfile = path.join(bannerdir, 'debug.log');
    await fs.writeFile(logfile, poutput.stdout, 'utf-8');
    await fs.writeFile(errfile, poutput.stderr, 'utf-8');
    // await $`ls -lh ${bannerdir}/*.log`
  } catch(error) {
    console.log(`Failure in connecting to ${info.site}: ${error.message}`);
  }

  /* the ID is unique every day, timedate is part of the path, 
   * this ensure predictable and daily ID, to avoid dups */
  const id = hash(name, bannerdir);
  // console.log(JSON.stringify(info));
  try {
    await $`${acquirer} --id ${id} --info ${JSON.stringify(info)} --campaign ${name} --source ${inspection}`.quiet();
    console.log(`Acquired ${hostname} into DB (${name})`);
  } catch(error) {
    console.log(`Impossible to acquire: ${error.message}`);
  }
}
