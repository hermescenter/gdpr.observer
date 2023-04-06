#!/usr/bin/env node
/* eslint-disable camelcase */

import { fs } from "zx";
import { parse } from "yaml";

import { create } from "../website-evidence-collector/lib/logger.js";
import collector from "../website-evidence-collector/collector/index.js";
import argv from "../website-evidence-collector/lib/argv.js";

let accept_texts = parse(await fs.readFile("./assets/accept.yaml", "utf-8"));

// Queste 2 variabili vengono prese da WEC come parametri
const UserAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3617.0 Safari/537.36";
const WindowSize = {
  width: 1680,
  height: 927, // arbitrary value close to 1050
};

(async () => {
  let args = argv.parse();

  // console.log("We're here ", args);

  let browser_collector = await collector(args, create({}, args));
  let browser = await browser_collector.createSession();
  // this inialize puppeteer

  let page = await browser_collector.getPage();
  // take the first page over which we play

  let result = await browser_collector.pageSession.har.page.evaluate(
    (accept_texts) => {
      let result = [];

      for (let type of accept_texts.elements) {
        var tags = document.getElementsByTagName(type);

        for (var i = 0; i < tags.length; i++) {
          for (let [code, language] of Object.entries(
            accept_texts.languages
          )) {
            for (let searchText of language) {
              let text = tags[i].textContent || tags[i].innerText;

              // spare resources: cut texts too short
              if(text.length > 30) {
                continue;
              }

              text = text.trim().toLowerCase();

              if (text.match(searchText)) {
                console.log(`matched string, proceeding clicking`);
                console.log(`[${text}], [${searchText}]`);

                let rect = tags[i].getBoundingClientRect();
                let xCenter = (rect.left + rect.right) / 2;
                let yCenter = (rect.top + rect.bottom) / 2;
                result.push({ xCenter, yCenter });
              } /* else {
                console.log(`Not matched [${text}], [${searchText}]`);
              } */
            }
          }
        }
      }
      console.log("results: ", result.length);
      return result;
    },
    // TODO
    // by testing with --headless false sometime you see
    // link uncorrectly clicked, like in
    // scripts/wec-clicker.mjs https://stackoverflow.com/ --page-timeout 3000 --overwrite --output output/banner1/2023-04-01/www.ilpost.it --consent true --headless  false
    accept_texts
  );

  for (let click of result) {
    // perhaps we can add a small milliseconds delay between the different
    // Clicks, and before clicking them, we can also highlight them with a red border
    // and save with a screenshot where we're going to click, as a double check.
    await browser_collector.pageSession.har.page.mouse.click(
      click.xCenter,
      click.yCenter
    );
  }
})();
