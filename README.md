
## European Third Party Inclusion Reporting

This project uses the European Data Protection Supervisor tool: website-evidence-collector

## Repository Map

* `site`: it contains the structure of a site in [HUGO](https://gohugo.io) and the content are automatically published in [etpir.hermescenter.org](https://etpir.hermescenter.org).
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
```

Then if you want to try WEC:

```
cd website-evidence-collector
bin/website-evidence-collector.js https://eportugal.gov.pt
```

---

### Contacts

* This project is coordinated by [Claudio Agosti](https://twitter.com/@_vecna), for the [Hermes Center](https://hermescenter.org).  Mail to <projects at hermescenter dot org>.
* A new discussion place for communities and organized should be defined

