
## European Third Party Inclusion Reporting

This project uses the European Data Protection Supervisor tool: website-evidence-collector

## Repository Map

* `site`: it contains the structure of a site in [HUGO](https://gohugo.io) and the content are automatically published in [gdpr.observer](https://gdpr.observer).
* `website-evidence-collector`: the original EDPS web analysis tool, you clone it by hand.
* `bin` contains the script to executed collections, analysis, import/export, and the `bin/backend.mjs` that exports the API.
* `input`: the files in YAML format containing the site to analyze.
* `.gitignore`: it excludes the `output` folder, `web-evidence-collector` and the `logs`.
* `output`: created folders and results, you can delete after the imports, as the data goes in a MongoDB
* `bin`: scripts to be executed

## How To

1. you need to have a valid list of URL, and perhaps with other additional metadata, in JSON or CSV format. **This list is named Batch**. Normally this list is in `input/` folder.
2. you can run a command to analyze a Batch. Normally this is associated with a country (i.e. the spanish privacy activist might have a Batch with all the public institutions). A Batch is a string, such as, "institution-ES-1"
3. If you want to expand the list of tested websites, it is suggested to change your Batch string to reflect it, such as "institution-ES-2", because you might want to avoid the growth of tested website interfere with your statistics.
4. Every Batch can be re-tested everyday. Testing the same Batch more often is discouraged (and not even guarantee it work).
5. You should `cd website-evidence-collector/assets; wget https://easylist.to/easylist/easyprivacy.txt` once a while (or git pull the repository `web-evidence-collector` to refresh the content, among them, `easyprivacy.txt`).

Now you're ready to lunch commands. These commands should be run after the [setup](#setup).

#### 1st: acquisition

```
bin/collect-with-wec.mjs --country XX --source input/portugal-partial.json
```

This command invokes also `bin/acquire.mjs` and `bin/id.mjs`, as well as `./website-evidence-collector/bin/website-evidence-collector.js`

#### 2nd: utilities

```
bin/produce-stats.mjs
```


#### 2nd+: additional collections

```
bin/consent-clicker.mjs --country EUI --source input/eui-30-selectors.yaml 
```

Please consider deleting the `tmp/udd_*` directories

#### 3rd: not yet completed

```
bin/infofetch.js
bin/airtable-fetcher.mjs
```

## Setup

The commands below assume your Linux system has a NodeJS version >= 16.x

```
npm install
git clone https://github.com/EU-EDPS/website-evidence-collector.git 
cd website-evidence-collector
npm install
cd ..
npm test
```

The last command would tell you if the system is ready to run. remind you need mongodb running in the server.

### Special: do you want to try WebEvidenceCollector?

```
cd website-evidence-collector
bin/website-evidence-collector.js https://eportugal.gov.pt
```

## Small sample

An example on which data is gather is in the [MONGODB](https://github.com/vecna/ETPIR/blob/main/MONGODB.md) file, it has been produced by running

```
npm install
bin/collect-with-wec.mjs
mongosh -d etpir-default -c beacons -q 'db.beacons.find({}).limit(1)'
```

Where `etpir-default` is the default database name, `beacons` is one of the collection generated based on the Web Evidence Collector output.

---

## Site maintenance & compilation

```
git submodule update --init 
cd site
hugo -D server
```

To update the theme:

```
git submodule update --remote --merge
```

### Contacts

* This project is coordinated by [Claudio Agosti](https://twitter.com/@_vecna), for the [Hermes Center](https://hermescenter.org).  Mail at `<projects at hermescenter dot org>`.
* A new discussion place for communities and organized should be defined.

### License

* AGPL-3
