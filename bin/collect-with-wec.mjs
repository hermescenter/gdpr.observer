#!/usr/bin/env node
/* eslint-disable camelcase */

import _ from 'lodash';
import { fs, $, os, fetch, path, question } from 'zx';
import { fetch as fogp } from 'fetch-opengraph';

void (async function () {

  const wec = `./website-evidence-collector/bin/website-evidence-collector.js`;
  const list = await fs.readJSON('input/portugual-partial.json');

  for (const site of list) {

    const urlo = new URL(site);
    const hostname = urlo.hostname;

    const banner0dir = path.join('output', 'banner0', hostname);
    await fs.ensureDir(banner0dir);
    const ogdir = path.join('output', 'og', hostname);
    await fs.ensureDir(ogdir);

    await question(`press Enter and test ${site} would start`);
    const output = await $`${wec} ${site} --output ${banner0dir}`;

    console.log(output);

    const metadir = path.join('output', 'metadata');
    await fs.ensureDir(metadir);
    const metafileo = path.join(metadir, hostname);
    
    await question(`press Enter to fetch ${site} metadata`);
    const x = await $`bin/infofetch.js ${site} ${metafileo}`;

    try {
      const ogpe = await fogp(site);

      console.log(ogpe);
    } catch(error) {
      console.log(`ogpe: ${error}`);
    }

  }
})();