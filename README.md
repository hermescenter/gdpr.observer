
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

the last command would tell you if the system is ready to run. remind you need mongodb running in the server.

### Special: do you want to try WebEvidenceCollector?

```
cd website-evidence-collector
bin/website-evidence-collector.js https://eportugal.gov.pt
```

## Small example

```
npm install
bin/collect-with-wec.mjs
```

Then read the debug messages. You should find result into mongodb.

---

### Contacts

* This project is coordinated by [Claudio Agosti](https://twitter.com/@_vecna), for the [Hermes Center](https://hermescenter.org).  Mail to <projects at hermescenter dot org>.
* A new discussion place for communities and organized should be defined

