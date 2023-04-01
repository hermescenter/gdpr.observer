#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs } from 'zx';
import { connect } from '../lib/mongodb.mjs';
import { stringify } from 'yaml';
import path from 'path';
import moment from 'moment';

console.log("This script might be not used, to run collector you can simply use --name");

if (!argv.name) {
  console.log("Missing campaign --name to pick from mongodb");
  process.exit(1);
}

const { mongodb } = (await fs.readJSON('./config/database.json'));
const client = await connect(mongodb);
const data = await client.db().collection("campaigns").find({}).toArray();
await client.close();

const outputf = path.join(`input`, `${argv.name}.yaml`);

const reformat = _.reduce(data, function(memo, e) {
  const saved = _.omit(e, ['_id', 'title', 'when', 'country']);
  saved.geoip = e.country;
  saved.batch = _.capitalize(argv.coll);
  saved.addedOn = moment(e.when).format("YYYY-MM-DD");
  _.set(memo, e.title, saved);
  return memo;
}, {});

fs.writeFileSync(outputf, stringify(reformat), 'utf-8');

console.log(`New input file produced in ${outputf}`);
