
## European Third Party Inclusion Reporting

This project uses the European Data Protection Supervisor tool: website-evidence-collector

## Repository Map

* `site`: it contains the structure of a site in [HUGO](https://gohugo.io) and the content are automatically published in [WEBSITE-TO-BE-DEFINED.org](https://xxx.org).
* `assets`: everything binary that might be used, reused, ans worthy of the shared. Presentation, articles, whatever
* `.gitignore`: it would let you understand why this repository has not code to crawl website
* `bin`: scripts to be executed

## Getting started

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

### Contacts

* This project is coordinated by [Claudio Agosti](https://twitter.com/@_vecna), for the [Hermes Center](https://hermescenter.org).  Mail at `<projects at hermescenter dot org>`.
* A new discussion place for communities and organized should be defined.


### License

* AGPL-3

