#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs, path } from 'zx';
import Airtable from 'airtable';

if (!argv.country) {
  console.log("Missing --country, which is a marker that would follow in the database (can be any kind of string)");
  console.log("And would also produce a file in `input/` folder as json");
  process.exit(1);
}

const settingsf = path.join('config', 'settings.json');
const settings = await fs.readJSON(settingsf);

Airtable.configure({
  apiKey: settings.airtable_key,
});

const base = new Airtable().base(settings.airtable_base);
const table = base.table(settings.airtable_table);

const d = await table.select().all();
const dati = _.map(d, 'fields');
const urls = _.map(dati, 'Canonical URL');

const destpath = path.join('input', `${argv.country}.json`);

if(fs.existsSync(destpath)) {
    console.log(`File ${destpath} exists and this script do not overwrite`);
    process.exit(1)
}

console.log(`Producing file ${destpath} with ${urls.length} urls`);
await fs.writeJSON(destpath, urls);
