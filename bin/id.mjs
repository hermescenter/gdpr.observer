#!/usr/bin/env node
/* eslint-disable camelcase */

import { argv, } from 'zx';
import crypto from 'crypto';

if (!argv.country) {
  console.log("Missing --country");
  process.exit(1);
}

if (!argv.path) {
  console.log("Missing --path");
  process.exit(1);
}

const sha1sum = crypto.createHash('sha1');
sha1sum.update(`${argv.country}${argv.path}`);
const id = sha1sum.digest('hex');
console.log(id);