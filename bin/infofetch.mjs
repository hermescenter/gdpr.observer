#!/usr/bin/env node
/* eslint-disable camelcase */
import _ from 'lodash';
import { argv, fs, $, os, path } from 'zx';
import dns from 'dns';
import geoip from 'fast-geoip'

import { fetch as fogp } from 'fetch-opengraph';
/* import metai from '../lib/metascraper.mjs'; */

if (!argv.source) {
  console.log("Missing --source, which should be a file");
  process.exit(1);
}

/* not actually used 

async function metascrap(site) {

  const urlo = new URL(site);
  const hostname = urlo.hostname;

  try {
    const x = await metai(site);
    return x;
  } catch(error) {
    console.log(`metascrap wrapper Error: ${error}`);
    return {};
  }
} */

const list = await fs.readFile(argv.source, 'utf-8');

for (let site of list.split('\n')) {

  if(!_.startsWith(site, 'http'))
    site = `http://${site}`;

  let metaidir = null;
  try {
    const urlo = new URL(site);
    const hostname = urlo.hostname;

    const day = new Date().toISOString().substring(0, 10);
    metaidir = path.join('output', 'metai', day, hostname);
  } catch(error) {
    console.log(`System error in ${site}: ${error.message}`);
    continue;
  }

  try {

    /* const res = await metascrap(site);
    if(JSON.stringify(res).length < 3)
       throw new Error(`Not actually produced data?`);
    const outf = path.join(metaidir, 'metascraper.json');
    await fs.writeFile(outf, JSON.stringify(res, undefined, 2), 'utf-8'); */
    const ogf = path.join(metaidir, 'ogp.json');
    if(fs.existsSync(ogf)) {
      console.log(`File ${ogf} exists, skipping`);
      continue;
    }

    const ogpe = await fogp(site);
    if(JSON.stringify(ogpe).length < 3)
      throw new Error(`Not actually produced OGP data?`);

    // Call to reverse function along with lookup function.
    const stripped = site.replace(/http?:\/\//, '');
    await dns.lookup(stripped,
      async function onLookup(err, address, family) {
        ogpe['ipv4'] = address;
        console.log(`IP resolved for ${site}: ${address}`)
        const location = await geoip.lookup(address);

        if(location.country) {
          ogpe.country = location.country;
          ogpe.region = location.region;
          ogpe.city = location.city;
          ogpe.timezone = location.timezone;
        }
        await dns.reverse(address, async function (err, hostnames) {

          if(hostnames && hostnames.length)
            ogpe['reverses'] = hostnames.join(',');

          await fs.ensureDir(metaidir);
          await fs.writeFile(ogf, JSON.stringify(ogpe, undefined, 2), 'utf-8');
          console.log(`Produced ${JSON.stringify(ogpe).length} OGP bytes (${site}) in ${JSON.stringify(_.pick(ogpe, ['country', 'region', 'city', 'timezone']))}`);
        });  
      }
    );

  } catch(error) {
    console.log(`${error.message} in ${site}`);
  }
}

console.log("Execution complete");
