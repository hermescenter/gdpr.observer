#!/usr/bin/env node
/* eslint-disable camelcase */
import _ from 'lodash';
import { argv, fs, $, path } from 'zx';
import dns from 'dns';
import geoip from 'fast-geoip';

import logger from 'debug';
const debug = logger('country-processor:domain');
const debugio = logger('country-processor:io');

import { fetch as fogp } from 'fetch-opengraph';
import { executeWithTimeout } from '../lib/timeouter.mjs';

if (!argv.source) {
  console.log("Missing --source, normally a .txt of URLs from rawlists/");
  console.log("Other options --name (necessary) --sessions and --seconds");
  process.exit(1);
}

if (!argv.name) {
  console.log("Missing --name (necessary later, would be in input/$name.yaml, and be the 'name' in the mongodb)");
  process.exit(1);
}
const campaignName = argv.name.trim();
const latestSymlink = path.join('output', 'metai', `${campaignName}-latest`);

const list = await fs.readFile(argv.source, 'utf-8');

/* here parallelization starts */
if (!argv.sessions) {
  console.log("--sessions 35 by default is assumed!");
}
const sessions = argv.sessions ? _.parseInt(argv.sessions) : 35;

const day = new Date().toISOString().substring(0, 10);
const seconds = _.parseInt(argv.seconds) || 0.1;
const entries = list.split('\n');
const chunksN = _.round(entries.length / sessions);
debugio(`Dividing ${entries.length} in ${chunksN} because of ${sessions} parallel sessions. new on ${seconds} seconds`);
const chunks = _.chunk(entries, chunksN);
let sessionActive = 0;

/* this is a non blocking function that loops until all the batch are full */
setInterval(async () => {

  if(chunks.length) {
    const batch = chunks.pop();
    sessionActive++;
    debugio(`[+] Session ${sessionActive}/${chunks.length} picked a batch of ${batch.length} sites, still to get ${chunks.length} chunks`);
    for (const site of batch) {
      debugio(`  ++ site ${site}, the ${batch.indexOf(site)} of ${batch.length}`);
      const rv = await processLine(site);
    }
    debugio(`Session completed ${sessionActive} decrements`);
    sessionActive--;
  }

}, seconds * 1000);

/* this is the final end loop that check completition of the batches */
setInterval(async () => {
  debugio("                     ", new Date());
  debugio("                     ", `${sessionActive}/${sessions}`, "sessions active");
  if(!sessionActive) {
    console.log(`Process complete, results in ${latestSymlink} now please use scripts/importer.mjs`);
    process.exit(0);
  }
}, 10000)

async function processLine(site) {

  if(_.startsWith(site, '#')) {
    console.log(`Skipping commented line ${site}`);
    return null;
  }
  if(site.length < 2)
    return null;

  if(!_.startsWith(site, 'http'))
    site = `http://${site}`;

  let metaidir, hostname, website = null;
  try {
    const urlo = new URL(site);
    hostname = urlo.hostname;
    website = `${urlo.protocol}//${urlo.hostname}`;
    metaidir = path.join('output', 'metai', campaignName, day);

    if(!fs.existsSync(metaidir))
      await $`mkdir -p ${metaidir}`

    // create symlink to the latest campaign day
    const dest = path.join(campaignName, day);
    try {
      await fs.symlink(dest, latestSymlink);
    } catch(error) {
      if(error.code != "EEXIST") {
        console.log(`Symlink error: ${error.message}`);
        process.exit(1);
      }
    }
  } catch(error) {
    console.log(`${error.code} in ${website}: ${error.message}`);
    return null;
  }

  try {

    const ogf = path.join(metaidir, `${hostname}.json`);
    if(fs.existsSync(ogf)) {
      debug(`File ${ogf} exists, skipping`);
      return null;
    }

    const ogpe = await executeWithTimeout(fogp, website, 5000, 'openGraph');
    const resolve = await executeWithTimeout(resolvef, hostname, 2000, 'resolver');
    const location = await executeWithTimeout(locationf, resolve.ipv4, 1000, 'geoip');
    const reverse = await executeWithTimeout(reversef, resolve.ipv4, 4000, 'reverse');

    if(JSON.stringify(ogpe).length < 3)
      throw new Error(`Missing website (OGP) data`);

    await fs.ensureDir(metaidir);
    await fs.writeFile(ogf, JSON.stringify({
      ...ogpe,
      ...resolve,
      ...location,
      ...reverse
    }, undefined, 2), 'utf-8');
    debug(`  Produced ${JSON.stringify(ogpe).length} OGP bytes (${site}) in ${JSON.stringify(location)}`);

  } catch(error) {
    console.log(`processLine: ${error.message} in ${site}`);
  }
}

async function resolvef(hostname) {
  // Call to reverse function along with lookup function.
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, address, family) => {
      if(err)
        reject(err);

      const retval = {};
      retval['ipv4'] = address;

      resolve(retval);
    });
  });
}

async function locationf(address) {
	try {
	  const info = await geoip.lookup(address);
    if(info && info.country) {
      return _.pick(info, ['country', 'region', 'city', 'timezone']);
    }
	}
	catch(error) {
    debug("Unable to resolve location of %s: %s", address, error.message);
	}
  return { location: false };
}

async function reversef(address) {
  // Call to reverse function along with lookup function.
  return new Promise((resolve, reject) => {
    dns.reverse(address, (err, hostnames) => {
      if(err)
        reject(err);

      const r = { reverses: "" };
      if(hostnames && hostnames.length)
        r.reverses = hostnames.join(',');

      resolve(r);
    });  
  });
}
