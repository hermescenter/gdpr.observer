#!/usr/bin/env node
/* eslint-disable camelcase */

// this command is invoked after the `country-collector.mjs`
// It produce a dir in output/metai/<NAME>-lastest symlink
// It also import into DB, because we've basically two method
// at the moment to run wec from command line.

import _ from 'lodash';
import { path, argv, fs } from 'zx';
import { connect } from '../lib/mongodb.mjs';
import crypto from 'crypto';

function pullOptional(content, prefix) {

  return _.reduce([prefix, `og:${prefix}`, `twitter:${prefix}` ], (memo, key) => {

    if(memo)
      return memo;

    if(_.get(content, key))
      return _.get(content, key, null);

  }, null);
  /* the code above is the equivalent of this, but works for 
   * 'description' and 'image' and potentially 'title'

  if(content.description)
    unit.description = content.description;
  else if(content['twitter:description'])
    unit.description = content['twitter:description'];
  else if(content['og:description'])
    unit.description = content['og:description'];
  */
}

if (!argv.source) {
  console.log(`(this command is invoked on the output of country-collector.mjs)`);
  console.log("Missing --source it is a directory from output/metai/*-latest");
  process.exit(1);
}

async function processFile(fileogp, name) {

  const fname = path.join(argv.source, fileogp);
  const content = await fs.readJSON(fname);
  const unit = _.pick(content, ['title', 'ipv4', 'country' ]);
  unit.site = content.url;
  unit.campaign = name.trim();

  unit.description = pullOptional(content, 'description');
  unit.image = pullOptional(content, 'image');

  if(!unit.description)
    delete unit.description;

  if(!unit.image)
    delete unit.image;

  if(content.reverses)
    unit.reverses = content.reverses.replace(/,/g, ' - ');

  const sha1sum = crypto.createHash('sha1');
  sha1sum.update(`*${unit.site}${unit.campaign}`);
  unit.id = sha1sum.digest('hex');

  unit.when = new Date();

  let client = null;
  try {
    const { mongodb } = (await fs.readJSON('./config/database.json'));
    client = await connect(mongodb);
    await client.db().collection("campaigns").createIndex({id: -1}, {unique: true});
    await client.db().collection("campaigns").insertOne(unit);
    console.log(`Imported ${fname} as unit into db.etpir.campaigns`);
  } catch(error) {
    console.log(`Unit not added: ${error.message}`);
  }
  if(client)
    await client.close();
}

const chunks = argv.source.split('/');
const name = chunks.pop().replace(/-latest/, '');
console.log(`Inferred name: ${name}`);

const files = fs.readdirSync(argv.source);
for (const fileogp of files) {
  await processFile(fileogp, name);
}
