#!/usr/bin/env node
/* eslint-disable camelcase */

/* this tool pick from mongodb and compute 
 * statistics based on the option passed */

import _ from 'lodash';
import { argv, fs, $, question } from 'zx';
import connect from '../lib/mongodb.mjs';

if (!argv.country) {
  console.log("Missing --country, this is fundamental, at the moment we've these:");
  console.log(await distinct('country'));
  process.exit(1);
}

if (!argv.kind) {
  console.log("Missing --kind (of statistics you want to produce)");
  console.log("Available: all, cookies");
  process.exit(1);
}

if(argv.kind === 'cookies' || argv.kind === 'all') {
  const data = await pullCookieData(argv.country);
  // console.table(data);
  // to be continued
}

async function pullCookieData(country) {
  const client = await connect();
  const amount = await client.db().collection("cookies").countDocuments({ country });
  console.log(`Amount of objects in 'cookies' matching ${country} as ${amount}`);
  const lasto = await client.db().collection("cookies")
    .find({ country }).sort({when: -1}).limit(1).toArray();
  const lastDay = lasto[0].when.substring(0, 10);
  console.log(`Last day observed for ${country} is ${lastDay}`);
  const evidences = await client.db().collection("cookies")
    .find({ country, when: { "$gte": new Date(lastDay)} }).sort({when: -1}).toArray();
  console.log(`Evidences found older then ${new Date(lastDay)} is ${evidences.length}`);

  await client.close();
  return evidences;
}


async function distinct(variableName) {
  const client = await connect();
  const list = await client.db().collection("hosts").distinct(variableName);
  await client.close();
  return list;
}