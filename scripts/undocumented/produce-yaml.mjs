#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs } from 'zx';
import { connect } from '../lib/mongodb.mjs';
import { stringify } from 'yaml';
import path from 'path';
import moment from 'moment';

if (!argv.coll) {
  console.log("Missing Source DB Collection --coll");
  process.exit(1);
}

const { mongodb } = (await fs.readJSON('./config/database.json'));
const client = await connect(mongodb);
const data = await client.db().collection(argv.coll).find({}).toArray();
await client.close();

const outputf = path.join(`input`, `${argv.coll}.yaml`);
console.log(`Producing YAML file in ${outputf}`);

const reformat = _.reduce(data, function(memo, e) {
  const saved = _.omit(e, ['_id', 'title', 'when', 'country']);
  saved.geoip = e.country;
  saved.batch = _.capitalize(argv.coll);
  saved.addedOn = moment(e.when).format("YYYY-MM-DD");
  _.set(memo, e.title, saved);
  return memo;
}, {});

fs.writeFileSync(outputf, stringify(reformat), 'utf-8');

console.log(`New input produced in ${outputf}`);
