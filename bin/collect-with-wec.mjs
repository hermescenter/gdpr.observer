#!/usr/bin/env node
/* eslint-disable camelcase */

import { fs, $, os, fetch, question } from 'zx';
import assert from 'assert';
import _ from 'lodash';

void (async function () {

  const wec = `./website-evidence-collector/bin/website-evidence-collector.js`;
  const list = await fs.readJSON('input/portugual-partial.json');

  for (const site of list) {
    await question(`press Enter and test ${site} would start`);
    const output = await $`${wec} ${site}`;
    console.log(output);
  }
})();