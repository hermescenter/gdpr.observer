#!/usr/bin/env node
/* eslint-disable camelcase */

/* this tool pick from mongodb and compute 
 * statistics based on the option passed */

import _ from 'lodash';
import { argv, fs, $ } from 'zx';
import connect from '../lib/mongodb.mjs';
import moment from 'moment';

const { mongodb } = (await fs.readJSON('./config/database.json'));

if (!argv.country) {
  console.log("Missing --country, this is fundamental, at the moment we've these:");
  // --country should become --batch and it is used the 'hosts' collection
  console.log(await distinct(mongodb, 'country'));
  process.exit(1);
}

if (!argv.kind) {
  console.log("Missing --kind (of statistics you want to produce)");
  console.log("Available: all, cookies");
  process.exit(1);
}

if(argv.kind === 'cookies' || argv.kind === 'all') {
  const data = await pullCookieData(mongodb, argv.country);
  const clean = _.map(data, function(o) {
    return {
      ..._.pick(o, ['country']),
      source: o.evidence.replace(/inspection.*/, ''),
      firstParty: _.filter(o.cookies, { firstPartyStorage: true }).length,
      thirdParty: _.filter(o.cookies, { firstPartyStorage: false }).length,
      /*
      firstParty: _.map(_.filter(o.cookies, { firstPartyStorage: true }), (c) => {
        return c.name;
      }).join(','),
      thirdParty: _.map(_.filter(o.cookies, { firstPartyStorage: false }), (c) => {
        return c.name;
      }).join(','),
      */
    }
  })
  console.table(clean);
  // to be continued
}

async function pullCookieData(mongodb, country) {
  const client = await connect(mongodb);
  const amount = await client.db()
    .collection("cookies")
    .countDocuments({ country });

  console.log(`Amount of objects in 'cookies' matching ${country} as ${amount}`);
  const lasto = await client.db()
    .collection("cookies")
    .find({ country })
    .sort({when: -1})
    .limit(1)
    .toArray();

  const lastDayStr = moment(lasto[0].when).format("YYYY-MM-DD");
  console.log(`Last day seen for [${country}] is ${lastDayStr}`);

  const evidences = await client.db()
    .collection("cookies")
    .find({ country, when: { "$gte": new Date(lastDayStr)} })
    .sort({when: -1})
    .toArray();

  const older = await client.db()
    .collection("cookies")
    .countDocuments({ country, when: { "$lt": new Date(lastDayStr)} })

  console.log(`Found ${evidences.length} evidences in ${lastDayStr} and ${older} older (ignored)`);

  await client.close();
  return evidences;
}


async function distinct(mongodb, variableName) {
  const client = await connect(mongodb);
  const list = await client.db()
    .collection("hosts")
    .distinct(variableName);
  await client.close();
  return list;
}
