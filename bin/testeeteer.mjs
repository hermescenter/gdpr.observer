#!/usr/bin/env node

import puppeteer from 'puppeteer';

const puppeteerConfig = {
    headless: false,
};

try {
    const browser = await puppeteer.launch(puppeteerConfig);
    console.log('1');
    const page = (await browser.pages())[0];
    await page.goto('https://www.coe.int', {
        waitUntil: "networkidle2",
    });
    console.log('2');
    await page.click(".coe-cookies-accept-all");
    console.log('3');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('4');
    const client = await page.target().createCDPSession();
    console.log('5');
    const cookies = await client.send('Network.getCookies');
    console.log(JSON.stringify(cookies, null, 2 ))
} catch(error) {
    console.log(error);
}