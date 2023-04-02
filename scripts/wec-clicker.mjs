#!/usr/bin/env node
/* eslint-disable camelcase */

import { fs, $, path } from "zx";
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
              text = text.trim().toLowerCase();

              if (text == searchText) {
                let rect = tags[i].getBoundingClientRect();
                let xCenter = (rect.left + rect.right) / 2;
                let yCenter = (rect.top + rect.bottom) / 2;
                result.push({ xCenter, yCenter });
              }
            }
          }
        }
      }
      return result;
    },
    accept_texts
  );

  for (let click of result) {
    await browser_collector.pageSession.har.page.mouse.click(
      click.xCenter,
      click.yCenter
    );
  }
})();
