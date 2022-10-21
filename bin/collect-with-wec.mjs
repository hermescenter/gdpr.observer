#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs, $, os, path } from 'zx';
import { fetch as fogp } from 'fetch-opengraph';

if (!argv.country) {
  console.log("Missing --country, which is a marker that would follow in the database (can be any kind of string)");
  process.exit(1);
}

if (!argv.source) {
  console.log("Missing --source, which should be a .json file with a list of URL");
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
const list = await fs.readJSON(argv.source);

for (const site of list) {

  const urlo = new URL(site);
  const hostname = urlo.hostname;

  const day = new Date().toISOString().substring(0, 10);
  const banner0dir = path.join('output', 'banner0', day, hostname);
  await fs.ensureDir(banner0dir);
  const ogdir = path.join('output', 'og', day, hostname);
  await fs.ensureDir(ogdir);

  try {
    const output = await $`${wec} ${site} --output ${banner0dir}`;
  } catch(error) {
    console.log(`Impossible to connect: ${error.message}`);
  }

  const inspection = path.join(banner0dir, 'inspection.json');
  /* the ID is unique every day, timedate is part of the path, 
    * this ensure predictable and daily ID, to avoid dups */
  const id = await $`${dailyIdGenerator} --country ${argv.country} --path ${banner0dir}`;
  console.log(`Site ${hostname} in ${day} has unique ID ${id}`);
  try {
    await $`${acquirer} --id ${id} --country ${argv.country} --source ${inspection}`
  } catch(error) {
    console.log(`Impossible to acquire: ${error.message}`);
  }

  /*
    -- not yet developed
  const metadir = path.join('output', 'metadata');
  await fs.ensureDir(metadir);
  const metafileo = path.join(metadir, hostname);
  await $`bin/infofetch.js ${site} ${metafileo}`;
  try {
    const ogpe = await fogp(site);

    console.log(ogpe);
  } catch(error) {
    console.log(`ogpe: ${error}`);
  }
  */

}

console.log("Execution complete");
