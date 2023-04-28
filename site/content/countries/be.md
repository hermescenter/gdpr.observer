---
title: "Belgium"
type: countries
date: 2018-11-19T10:47:58+10:00
draft: false
---

### This country is not yet initialized and only a small default of websites are analyzed.

* `TODO visualization of the small default`
* Engage with translator
* get a list of websites to test, and then:

```
v :~/D/gdpr.observer $ wc -l rawlists/BE--scraped.txt 
140 rawlists/BE--scraped.txt

scripts/country-processor.mjs --source rawlists/BE--scraped.txt --name BEs
[...]
  IP resolved for www.parlement-wallonie.be: 193.190.147.205
  Produced 854 OGP bytes (http://www.parlement-wallonie.be) in {"country":"BE","region":"VLG","city":"Kortrijk","timezone":"Europe/Brussels"}
  ++ site www.aeronomie.be
  IP resolved for www.kbr.be: 185.99.48.31
  Produced 1265 OGP bytes (http://www.kbr.be) in {"country":"BE","region":"WAL","city":"Montigny-le-Tilleul","timezone":"Europe/Brussels"}
  ++ site incc.fgov.be
[...]
```

The script above has resolved the [OpenGraph protocol](https://ogp.me) of all the website listed, and resolved+reverse+geoip of all their IP address. It produces these files:

```
v :~/D/gdpr.observer $ ls -l output/metai/
total 4
drwxrwxr-x 3 v v 4096 Apr 28 01:35 BEs
lrwxrwxrwx 1 v v   14 Apr 28 01:35 BEs-latest -> BEs/2023-04-28
v :~/D/gdpr.observer $ ls -l output/metai/BEs/2023-04-28/ 
total 452
-rw-rw-r-- 1 v v  476 Apr 28 01:36 cert.be.json
-rw-rw-r-- 1 v v  883 Apr 28 01:36 cert.europa.eu.json
-rw-rw-r-- 1 v v  643 Apr 28 01:36 chancellerie.belgium.be.json
-rw-rw-r-- 1 v v  684 Apr 28 01:36 cirb.brussels.json
[...]
```

Then you need to import them into the database, `BEs` is the name of the **campaign** in this case.

```
v :~/D/gdpr.observer $ scripts/importer.mjs --source output/metai/BEs-latest
Inferred name: BEs
[...]
Imported output/metai/BEs-latest/www.vives.be.json as unit into db.gdpro.campaigns
Imported output/metai/BEs-latest/www.vlaanderen.be.json as unit into db.gdpro.campaigns
Imported output/metai/BEs-latest/www.wallonie.be.json as unit into db.gdpro.campaigns
Imported output/metai/BEs-latest/www.warheritage.be.json as unit into db.gdpro.campaigns
Completed!: added 113, duplicated 0
```

You should point to `-latest` because is the most updated.

## Now you're ready to collect evidences!

```
v :~/D/gdpr.observer$ scripts/collector.mjs --name BEs
--session 5 by default is assumed!
--consent false by default is assumed
With BEs we picked 113 sites
[...]
```

