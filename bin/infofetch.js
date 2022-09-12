#!/usr/bin/env node
/* eslint-disable camelcase */

const { metai } = require('../lib/metascraper');

void (async function () {

  const site = process.argv[2];
  const outputfile = process.argv[3];

  console.log(site, outputfile);
  const urlo = new URL(site);
  const hostname = urlo.hostname;

  try {
    const x = await metai(site);
    console.log(x);
  } catch(error) {
    console.log(`metai: ${error}`);
  }

})();