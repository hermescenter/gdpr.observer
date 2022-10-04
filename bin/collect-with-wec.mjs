#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { fs, $, os, fetch, path, question } from 'zx';
import { fetch as fogp } from 'fetch-opengraph';


/* hardcoded for the alpha version */
const country = "portugal";

/* this script execute in sequence:
 * 1) wec
 * 2) produce a unique ID so every website can have only one entry per day in the DB
 * 3) acquire the produced output of wec into mongodb
 */

const wec = `./website-evidence-collector/bin/website-evidence-collector.js`;
const acquirer = `./bin/acquire.mjs`;
const dailyIdGenerator = `./bin/id.mjs`;
const sourceList = path.join("input", `${country}-partial.json`);
const list = await fs.readJSON(sourceList);

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
  const id = await $`${dailyIdGenerator} --country ${country} --path ${banner0dir}`;
  console.log(`Site ${hostname} in ${day} has unique ID ${id}`);
  try {
    await $`${acquirer} --id ${id} --country ${country} --source ${inspection}`
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
