
## European Third Party Inclusion Reporting

This project uses the European Data Protection Supervisor tool: website-evidence-collector

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
# Install EDPS's WEC - Website Evidence Collector as submodule:
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

Now you're ready to lunch commands. These commands should be run after the [setup](#setup).

#### 0es: get input ready

Imagine you've a list of URLs like:

```
cat input/pt-list.1.txt | head -4 
accessmonitor.acessibilidade.gov.pt
arquivonacionaldosom.gov.pt
builtcolab.pt
c2tn.tecnico.ulisboa.pt
```

You need to transform it in a more complex format, like:



#### 1st: acquisition

```
bin/collect-with-wec2.mjs --country edri --source input/edri.yaml
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
* A new discussion place for communities and organized should be defined.

### License

* AGPL-3
