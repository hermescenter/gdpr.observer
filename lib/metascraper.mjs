import getHTML from 'html-get';

/**
 * `browserless` will be passed to `html-get`
 * as driver for getting the rendered HTML.
 */
import B from 'browserless';

const browserless = B();

const getContent = async url => {
  // create a browser context inside the main Chromium process
  const browserContext = browserless.createContext()
  const promise = getHTML(url, { getBrowserless: () => browserContext })
  // close browser resources before return the result
  promise.then(() => browserContext).then(browser => browser.destroyContext())
  return promise
}

/**
 * `metascraper` is a collection of tiny packages,
 * so you can just use what you actually need.
 */
import metascraper from 'metascraper';

/**
 * The main logic
 */
async function metai(site) {
  await getContent(site)
    .then(metascraper)
    .then(metadata => console.log(metadata))
    .then(browserless.close);
};

export default metai;
