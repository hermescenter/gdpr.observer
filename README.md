
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
* `bin` Software commands to perform collections, analysis, import/export, API webserver `bin/backend.mjs` .
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
# Install GDPR Observer
```
# clone the repository
git clone https://github.com/hermescenter/gdpr.observer.git
cd gdpr.observer
# Install GDPR Observer
npm i
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
scripts/country--processor.mjs --source $file --name $campaign
```
To generate all output files enriched you can run the following one-liner, it may take some time because it will connect to all rawlists websites:
```
cd rawlist/
for file in * ; do echo bin/infofetch.mjs --source $file --name $file;  (bin/infofetch.mjs --source $file&) ; done
```
Outputs are by default organized by countries, default provided for each country where GDPR does apply, but possibly also other lists. 
You can see the output being generated for each file from rawfiles, providing one file for each country:
```
ls output/metai/{IT,ES,DE,BE}
```

#### YAML File Generation from OpenGraph Enriched Output

Now we need to generate the YAML file as input for gdpr observer software.
```
bin/importer.mjs --sources output/metai/IT-latest --coll IT
```


YAML list file to be generated with the following example syntax:

```
Amnesty International:
  ipv4: 141.193.213.21
  site: http://amnesty.org
  description: We campaign for a world where human rights are enjoyed by all
  image: https://www.amnesty.org/en/wp-content/uploads/2019/12/whoweare_2944x1224_header.jpg
  id: dd7b59427ccca244ab14c14d059169d730926b2c
  geoip: US
  batch: edri
  addedOn: 2023-02-23
```

#### 1st: acquisition

```
bin/collector.mjs  # TODO & review
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

---

### Contacts

* This project is coordinated by [Claudio Agosti](https://twitter.com/@_vecna), for the [Hermes Center](https://hermescenter.org).  Mail at `<projects at hermescenter dot org>`.
* To participate join our [Matrix Chat](https://matrix.to/#/#gdpr.observer:matrix.org) 

### License

* AGPL-3

## REMINDER

* http://localhost:28000/evidences/2023-04-01/amnesty.org/screenshot-full.png
* removed metascraper, only 'fetch-opengraph' is kept
