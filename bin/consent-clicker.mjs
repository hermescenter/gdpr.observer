#!/usr/bin/env node

import _ from 'lodash';
import puppeteer from 'puppeteer';
import { argv, fs, $, os, path, YAML } from 'zx';

const puppeteerConfig = {
  headless: true,
  userDataDir: null,
};

async function runPuppeteer(site, selector) {

  try {
    puppeteerConfig.userDataDir = path.join('tmp', `udd_${_.random(0, 0xffff)}`);
    await fs.ensureDir(puppeteerConfig.userDataDir);

    const browser = await puppeteer.launch(puppeteerConfig);
    const page = (await browser.pages())[0];
    await page.goto(site, {
      waitUntil: "networkidle2",
    });

    if(!selector || !selector.length) {
        console.log("No selector means no consent to click on!");
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await page.click(selector);
    }

    const client = await page.target().createCDPSession();
    const cookies = await client.send('Network.getCookies');
    await browser.close();
    console.log(`Collected #${cookies?.cookies?.length} cookies`)
    return _.get(cookies, 'cookies');
  } catch(error) {
    console.log(`Error in executing Puppeteer: ${error.message}`);
    return null;
  }
}

if (!argv.country) {
  console.log("Missing --country, which is a marker that would follow in the database (can be any kind of string)");
  process.exit(1);
}

if (!argv.source) {
  console.log("Missing --source, which should be a .json file with a list of URL");
  process.exit(1);
}

const data  = fs.readFileSync(argv.source, 'utf-8');
const source = YAML.parse(data);
/* source should be: {
    "European Parliament": {
        "site": "http://...",
        "selector": "..."
    }
    "European Commission": {}
} */
const trimmed = _.map(source, function(e, k) {
    return {
        ...e,
        name: k
    }
})

for (const entry of trimmed) {

  const urlo = new URL(entry.site);
  const hostname = urlo.hostname;

  const day = new Date().toISOString().substring(0, 10);
  const banner1dir = path.join('output', 'banner1', day, hostname);
  await fs.ensureDir(banner1dir);

  let cookies = null;
  try {
    console.log(`Connecting to ${entry.name}`);
    cookies = await runPuppeteer(entry.site, entry.selector);
    console.log(_.map(cookies, function (e) { return _.pick(e, ['domain', 'name'])}));
  } catch(error) {
    console.log(`Impossible to connect: ${error.message}`);
  }

  if(cookies) {
    const cookief = path.join(banner1dir, 'cookies.json');
    await fs.writeFile(cookief, JSON.stringify(cookies, undefined, 2), 'utf-8');
  }

  /*
  const id = await $`${dailyIdGenerator} --country ${argv.country} --path ${banner0dir}`;
  console.log(`Site ${hostname} in ${day} has unique ID ${id}`);
  try {
    await $`${acquirer} --id ${id} --country ${argv.country} --source ${inspection}`
  } catch(error) {
    console.log(`Impossible to acquire: ${error.message}`);
  }
 */
}

console.log("Execution complete");
process.exit(1);