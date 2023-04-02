
## GDPR Observer Project

This project provide a scalable and collaborative software platform and service for:
- Enable NGOs and DPAs (and anyone) to perform GDPR Compliance Checks in a code-free (SAAS) way
- Provide Automatic and Continuous Data Collection / Analisys of Website's Collections
- Display searchable results of Compliance Checks organized by Collection names (default, by Country)
- Provide an OpenData accessible API of Raw Data (to develop Compliance Checks) and GDPR Compliance Checks results
- Enable automatic sending of GDPR Compliance Email to Data Processor and it's DPO

It's specifically designed to enable contribution in any steps for the process in making it scalable across Europe:
- Enable contribution of Collections of lists Websites to subject to GDPR Observation (e.g. Collection by country, by organizations, etc)
- Enable contribution of additional metadata to Collections such as DPO's email or Categories (e.g. Schools, Hospitals, Ministries, etc)
- Enable curation of Collection's GDPR Compliance Check results by validating it (e.g. Before sending a compliance email)
- Enable contribution and localization of GDPR Compliance Email 
- Enable contribution and Diagnostic of Acceptance Consent Clicking Semantic texts

Compliance Checks are performed by multiple technical means, mainly by uses of the European Data Protection Supervisor tool's [Website Evidence Collector](https://github.com/EU-EDPS/website-evidence-collector).

GDPR Observer extend and improve WEC:
1. With a multi-language Acceptance Consent Clicker
2. Elaborating Compliance Checks from its scan results data

# Contribute to the project
You can contribute to the project in the following way:
- Provide and Enrich collections of websites of your own country
- Contribute to the Acceptance Consent Clicker in your language
- Localize the web pages displaying the results and Compliance Emails
- Starts GDPR Compliance Email campaigns in your country

To participate join our [Matrix Chat](https://matrix.to/#/#gdpr.observer:matrix.org) .


## Repository Map

* `site`: it contains the structure of a site in [HUGO](https://gohugo.io) and the content are automatically published in [gdpr.observer](https://gdpr.observer).
* `website-evidence-collector`: the original EDPS web analysis tool you clone it by hand.
* `scripts` Software commands to perform collections, analysis, import/export, API webserver `scripts/backend.mjs` .
* `input`: The sites/domains lists to be analyzed as the input of the software, defined in YAML format .
* `output`: created folders and results, you can delete after the imports, as the data goes in a MongoDB
* `.gitignore`: it excludes the `output` folder, `web-evidence-collector` and the `logs`.

# Setup 

The commands below assume your Linux system has a NodeJS version >= 16.x on Linux Debian systems.

You need in sequence to:

# Install NPM from source by installing node
```
# as per https://github.com/nodejs/help/wiki/Installation
wget https://nodejs.org/dist/v18.15.0/node-v18.15.0-linux-x64.tar.xz
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-v18.15.0-linux-x64.tar.xz -C /usr/local/lib/nodejs 
echo 'export PATH=/usr/local/lib/nodejs/node-v18.15.0-linux-x64/bin:$PATH' >> $HOME/.profile
source $HOME/.profile
```

# Install MongoDB (latests)
From https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-debian/
Instruction for Ubuntu 20.04, check manual for appropriate source

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```
If there are problems in starting up mongodb automatically you can always start it manually:
```
sudo /usr/bin/mongod -f /etc/mongod.conf
```

# Install GDPR Observer
```
# clone the repository
git clone https://github.com/hermescenter/gdpr.observer.git
cd gdpr.observer
# Install GDPR Observer
npm i
git submodule update --init
# clone the EDPS's WEC - Website Evidence Collector repository:
git clone https://github.com/EU-EDPS/website-evidence-collector.git
cd website-evidence-collector
npm install
cd ..
```

The last command would tell you if the system is ready to run. remind you need mongodb running in the server.

## How To

1. you need to have a valid list of URLs, pssibly with other additional metadata such as owners data and DPO email contact, in JSON or CSV format. **This list is named Batch**. Normally this list is in `input/` folder.
2. you can run a command to analyze a Batch. Normally this is associated with a country (i.e. the spanish privacy activist might have a Batch with all the public institutions). A Batch is a string, such as, "institution-ES-1"
3. If you want to expand the list of tested websites, it is suggested to change your Batch string to reflect it, such as "institution-ES-2", because you might want to avoid the growth of tested website interfere with your statistics.
4. Every Batch can be re-tested everyday. Testing the same Batch more often is discouraged (and not even guarantee it work).
5. You should `cd website-evidence-collector/assets; wget https://easylist.to/easylist/easyprivacy.txt` once a while (or git pull the repository `web-evidence-collector` to refresh the content, among them, `easyprivacy.txt`).

Now you're ready to start your analysis. These commands should be run after the [setup](#setup).

#### Input Country Lists

Input Lists are the lists of websites and it's associated metadata, by default categorized by Country, that can be generated from Raw Files present in the rawlists\ directory:

```
# See lists of Germany rawlist. You can build new lists.
ls rawlists\
head -4 rawlists/DE.txt
```

# OpenGraph Enrichment from RawLists

Raw Files are automatically enriched with additional metadata using the [OpenGraph protocol](https://ogp.me), GeoIP and DNS reserve.

By default a Rawlist of websites for each country subject to GDPR are provided, with only two entries: The Parliament and the Data Protection Authority. With contribution and curation by the community will be extended to all public agencies and beyond.

The enriched country files will be saved into `output\metai\COUNTRY` directory, generated with the following command:
```
scripts/country-processor.mjs --source $file --name $file
```
To generate all output files enriched you can run the following one-liner, it may take some time because it will connect to all rawlists websites:
```
TO BE FIXED: Basename on --name parameter and execution from root, not from raflists

for file in * ; do echo ../scripts/country-processor.mjs --source $file --name $file;  (../scripts/country-processor.mjs --name $file --source $file&) ; done
```
Outputs are by default organized by countries, default provided for each country where GDPR does apply, but possibly also other lists. 
You can see the output being generated for each file from rawfiles, providing one file for each country:
```
ls output/metai/{IT,ES,DE,BE}
```

#### Database import from OpenGraph Enriched Collections

Now we need to import into the database the enriched websites from collections:
```
scripts/importer.mjs --source output/metai/DE.txt-latest
scripts/importer.mjs --source output/metai/*-latest
```


The imported data can be query with the following comand:

```
mongosh  gdpro --eval "db.campaigns.find()"
```
Below an example output:

```
    _id: ObjectId("64297cd198f7aa5c2b44aae9"),
    title: 'German Bundestag - Homepage',
    ipv4: '46.243.122.50',
    country: 'DE',
    site: 'https://www.bundestag.de/en',
    campaign: 'DE.txt',
    description: 'Homepage of the German Bundestag, the national parliament of the Federal Republic of Germany',
    image: 'https://www.bundestag.dehttps://www.bundestag.de/resource/blob/710792/1412e3a264dedb70095c5662743aee3e/adler-data.png',
    reverses: 'www.bundestag.de',
    id: '173561af168120ed11d6d0f46e1dc00ceba979d6',
    when: ISODate("2023-04-02T13:02:08.952Z")
```

#### 1st: acquisition
We are now ready to starts collecting data:

```
scripts/collector.mjs --name DE.txt
```

This command uses and execution also `scripts/internal/*` and `./website-evidence-collector/bin/website-evidence-collector.js`

The acquired data has been saved into the mondodb, in raw formats for later processing to analyze Compliance Checks.

All the collector's raw data set is available via APIs, also providing a means for extended data enrichments.

Is possible to have a look at the datas by exploring:
```
mongosh  gdpro --eval "db.getCollectionNames()"

[
  'links',
  'secure_connection',
  'beacons',
  'campaigns',
  'browsing_history',
  'uri_refs',
  'cookies',
  'hosts'
]
```

You can looks at those raw data, for example checking "hosts" table:

```
mongosh  gdpro --eval "db.hosts.find()"
{
    _id: '64297cd198f7aa5c2b44aae9',
    id: '34b6a1a70eb52d7322c2c0071ad036f601b7989d',
    evidence: 'output/banner0/2023-04-02/www.bundestag.de/inspection.json',
    campaign: 'DE.txt',
    acquiredAt: ISODate("2023-04-02T13:36:09.963Z"),
    title: 'German Bundestag - Homepage',
    ipv4: '46.243.122.50',
    country: 'DE',
    description: 'Homepage of the German Bundestag, the national parliament of the Federal Republic of Germany',
    image: 'https://www.bundestag.dehttps://www.bundestag.de/resource/blob/710792/1412e3a264dedb70095c5662743aee3e/adler-data.png',
    reverses: 'www.bundestag.de',
    when: '2023-04-02T13:02:08.952Z',
    name: '0',
    siteId: '173561af168120ed11d6d0f46e1dc00ceba979d6',
    hosts: {
      requests: {
        firstParty: [ 'www.bundestag.de' ],
        thirdParty: [
          'www.bundestag.de',
          'webtv.bundestag.de',
          'statistik.bundestag.de'
        ]
      }
 
 ```

It's also possible to access the screenshots being collected with the browser:

TODO: Fix with latests relative url
 ```
 http://localhost:28000/evidences/2023-04-02/www.bundestag.de/screenshot-full.png
 ```
 
#### 2nd: Start Backend Process
We need now to start the backend process exposing the API to interact with the data:

```
nohup npm run backend &
```
#### 3rd: Extract data with the API

TODO: Fix with latests relative url
To play with the API extraction you can for example check the third party trackers and cookies of a collection's of websites.

Variables are the name of the "collection" and the "date" of collection.
```
curl http://127.0.0.1:28000/api/data/DE.txt/2023-04-02
```


#### +: Data enrichments
Additional data enrichment, being developed but not yet implemented, can be tested.

Below the in-development consent acceptance clicker functionality:
```
scripts/collector.mjs --name DE.txt --consent

```

Please consider deleting the `tmp/udd_*` directories

#### Contributing to the website
To contribute in content editing of the website of GDPR Observer you will need to install and uses [HUGO](https://gohugo.io/) software framework.
With Hugo web pages are edited in markdown under the folder site/content/ .
```
sudo apt install hugo
cd site/
hugo
```

This will show the current sites data:
```
                   | EN
-------------------+-----
  Pages            | 29
  Paginator pages  |  0
  Non-page files   |  1
  Static files     | 74
  Processed images |  0
  Aliases          |  0
  Sitemaps         |  1
  Cleaned          |  0
```

To modify the website you need to starts the HUGO server to open it as http://localhost:1313/
```
hugo -D server
```

#### Contributing to the Acceptance Consent Clicker Language Dictionaries

The software need to collect cookies before and after clicking on an acceptance consent banner.
This is a very important feature in order to automatically later execute Compliance Checker.

This works by matching a set of language specific words and sentences with the text contained in the buttons visible in a web page.
For example "I Accept" can be a way to identify in english language a likely button to be clicked to Accept Consent.

You can contribute to improve your language specific Dictionary for a reliable Acceptance Consent Clicker:
TODO: Organize the ay to manage the contribution and the status of localization of Acceptance Content Clicker.


#### Contributing to the Legal Compliant Email and Localization

The software, in order to notify a positive Compliance Check, need to send compliants in the right language of the recipient.
You can contribute by localizing the Email Complaint checks in your language by checking the templates not yet translated on:

TODO: Organize the way to manage the Compliant Email in different languages, which one is available and which not.


---

### Contacts

* This project is coordinated by [Claudio Agosti](https://twitter.com/@_vecna), for the [Hermes Center](https://hermescenter.org).  Mail at `<projects at hermescenter dot org>`.
* To participate join our [Matrix Chat](https://matrix.to/#/#gdpr.observer:matrix.org) 

### License

* AGPL-3
