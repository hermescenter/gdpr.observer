#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { argv, fs, $, fetch, question } from 'zx';
import connect from '../lib/mongodb.mjs';

if (!argv.country) {
  console.log("Missing --country");
  process.exit(1);
}

if (!argv.source) {
  console.log("Missing --source");
  process.exit(1);
}

if (!argv.id) {
  console.log("Missing --id");
  process.exit(1);
}

if (!_.endsWith(argv.source, '.json')) {
  console.log("--source should end as .json as is expected a JSON file");
  process.exit(1);
}
console.log("Validation successful");


const content = await fs.readJSON(argv.source);


/* every key should go in a dedicated collection */
const mongoqs = _.compact(_.map(content, function(value, key) {
  if(typeof value === 'string') {
    console.log(`Skipping ${key} ${value}`);
    return null;
  }
  if(JSON.stringify(value).length < 3 || value === null) {
    console.log(`Empty value in ${key} ${JSON.stringify(value)}`);
    return null;
  }
  if(key === 'uri_refs') {
    /* this helps a lot to sort see hostname and pick the appropriate ID */
    console.log(`${JSON.stringify(value)} becoming a string`);
    value = _.first(value);
  }
  if(key === 'browser' || key === 'script') {
    /* these variables contains info from WEC, are not meaningful for us */
    return null;
  }

  const retval = {
    collection: key,
    content: {
      id: argv.id,
      evidence: argv.source,
      country: argv.country,
      when: new Date(),
    }
  }
  retval.content[key] = value;
  return retval;
}))

const client = await connect();
for(const block of mongoqs) {
  await client.db().collection(block.collection).insertOne(block.content);
}
await client.close();

console.log(`Written ${mongoqs.length} entries`);
