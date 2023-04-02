#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs, $, path } from 'zx';
import { parse } from 'yaml';
import { connect } from '../lib/mongodb.mjs';

if (!argv.source && !argv.name) {
  console.log("Missing --name or --source");
  console.log("--name is the field 'campaign' in (db.etpir.campaings)");
  console.log("--source is a YAML file in input/; check README.md");
  process.exit(1);
}

/* this script execute in sequence:
 * 1) wec
 * 2) produce a unique ID so every website can have only one entry per day in the DB
 * 3) acquire the produced output of wec into mongodb */

const wec = `./website-evidence-collector/bin/website-evidence-collector.js`;
const acquirer = `./scripts/internal/mongosave.mjs`;
const dailyIdGenerator = `./scripts/internal/id.mjs`;

const { name, data } = await acquireSource(argv.source, argv.name);

/* this is the parallelizzation logic that needs debug */
const chunksN = 12
const chunks = _.chunk(_.keys(data), chunksN);

await setInterval(async () => {

  if(!chunks.length) {
    console.log("Batch all consumed...")
  } else {
    const batch = chunks.pop();
    for (const index of batch) {
      console.log(`Of the ${chunksN} wec ${batch.join('_')}: ${data[index].title}`);
      await processURL(index);
    }
  }

}, 3000);

await setTimeout(async () => {
  console.log(`This process should keep hanging till ${data.length * 20000}`);
}, data.length * 20000)

async function acquireSource(source, name) {

  if(source) {
    const data = parse(await fs.readFile(argv.source, 'utf-8'));
    console.log(`With ${source} we picked ${data.length} sites`);
    const c = argv.source.split('/').pop();
    return {
      name: c.replace(/\.yaml/, ''),
      data
  }
  } else {
    const { mongodb } = (await fs.readJSON('./config/database.json'));
    const client = await connect(mongodb);
    const data = await client.db().collection("campaigns").find({campaign: name}).toArray();
    console.log(`With ${name} we picked ${data.length} sites`);
    await client.close();
    return {
      name,
      data
    }
  }
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

  const day = new Date().toISOString().substring(0, 10);
  const banner0dir = path.join('output', 'banner0', day, hostname);
  await fs.ensureDir(banner0dir);

  const inspection = path.join(banner0dir, 'inspection.json');
  if(fs.existsSync(inspection)) {
    console.log(`File ${inspection} is present, skipping!`);
    return;
  }

  try {
    const poutput = await $`${wec} ${info.site} --page-timeout 30000 --overwrite --output ${banner0dir}`.quiet();
    const logfile = path.join(banner0dir, 'stdout.log');
    const errfile = path.join(banner0dir, 'debug.log');
    await fs.writeFile(logfile, poutput.stdout, 'utf-8');
    await fs.writeFile(errfile, poutput.stderr, 'utf-8');
    await $`ls -lh ${banner0dir}/*.log`
  } catch(error) {
    console.log(`Failure in connecting to ${info.site}: ${error.message}`);
  }

  /* the ID is unique every day, timedate is part of the path, 
   * this ensure predictable and daily ID, to avoid dups */
  const id = await $`${dailyIdGenerator} --country ${name} --path ${banner0dir}`;
  console.log(`Site ${hostname} in ${day} has unique ID ${id}`);
  console.log(JSON.stringify(info));
  try {
    await $`${acquirer} --id ${id} --info ${JSON.stringify(info)} --campaign ${name} --source ${inspection}`.quiet();
    console.log(`Acquired ${hostname} into DB (${name})`);
  } catch(error) {
    console.log(`Impossible to acquire: ${error.message}`);
  }
}
