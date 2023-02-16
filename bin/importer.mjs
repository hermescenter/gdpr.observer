#!/usr/bin/env node
/* eslint-disable camelcase */

// this command is invoked after the `infofetch.mjs`
// `infofetch` produces a bunch of `ogp.json`
// and this import it in a DB, so later on it can be
// used to produce a YAML file which would become the 
// input for `collect-with-wec.mjs` second version.

import _ from 'lodash';
import { argv, fs } from 'zx';
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

if (!argv.ogp) {
  console.log(`(this command is invoked on the output of infofetch.mjs)`);
  console.log("Missing --ogp");
  process.exit(1);
}

if (!argv.coll) {
  console.log("Missing Target DB Collection --coll");
  process.exit(1);
}

const content = await fs.readJSON(argv.ogp);
const unit = _.pick(content, ['title', 'ipv4', 'country' ]);
unit.site = content.url;

/* optional fields */
unit.description = pullOptional(content, 'description');
unit.image = pullOptional(content, 'image');

if(!unit.description)
  delete unit.description;

if(!unit.image)
  delete unit.image;

if(content.reverses)
  unit.reverses = content.reverses.replace(/,/g, ' - ');

const sha1sum = crypto.createHash('sha1');
sha1sum.update(`*${unit.site}`);
unit.id = sha1sum.digest('hex');

unit.when = new Date();

const { mongodb } = (await fs.readJSON('./config/database.json'));
const client = await connect(mongodb);
await client.db().collection(argv.coll).createIndex({id: -1}, {unique: true});
try {
  await client.db().collection(argv.coll).insertOne(unit);
  console.log("Added unit!");
} catch(error) {
  console.log(`Unit not added: ${error.message}`);
}
await client.close();