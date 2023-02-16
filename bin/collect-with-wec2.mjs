#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs, $, os, path } from 'zx';
import { parse } from 'yaml';

if (!argv.country) {
  console.log("Missing --country, which is a marker that would follow in the database (can be any kind of string)");
  process.exit(1);
}

if (!argv.source) {
  console.log("Missing --source, which should be a .yaml file");
  process.exit(1);
}

if(!_.endsWith(argv.source, '.yaml')) {
  console.log("Possible invalid format, expecting .yaml as --source");
  process.exit(1);
}

/* this script execute in sequence:
 * 1) wec
 * 2) produce a unique ID so every website can have only one entry per day in the DB
 * 3) acquire the produced output of wec into mongodb
 */

const wec = `./website-evidence-collector/bin/website-evidence-collector.js`;
const acquirer = `./bin/acquire.mjs`;
const dailyIdGenerator = `./bin/id.mjs`;
const list = parse(await fs.readFile(argv.source, 'utf-8'));

for (const title of _.keys(list) ) {

  const info = list[title];

  let hostname = null;
  try {
    const urlo = new URL(info.site);
    hostname = urlo.hostname;
  } catch(error) {
    console.log(`Invalid URL? (${info.site}) ${error.message}`);
    console.log(JSON.stringify(info, undefined, 2));
    continue;
  }

  const day = new Date().toISOString().substring(0, 10);
  const banner0dir = path.join('output', 'banner0', day, hostname);
  await fs.ensureDir(banner0dir);

  const inspection = path.join(banner0dir, 'inspection.json');
  if(fs.existsSync(inspection)) {
    console.log(`File ${inspection} present, skipping!`);
    continue;
  }

  try {
    const poutput = await $`${wec} ${info.site} --overwrite --output ${banner0dir}`.quiet();
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
  const id = await $`${dailyIdGenerator} --country ${info.batch} --path ${banner0dir}`;
  console.log(`Site ${hostname} in ${day} has unique ID ${id}`);
  try {
    await $`${acquirer} --id ${id} --country ${info.batch} --source ${inspection}`.quiet();
    console.log(`Acquired ${hostname} into DB (${info.batch})`);
  } catch(error) {
    console.log(`Impossible to acquire: ${error.message}`);
  }

}

console.log("Execution complete");
