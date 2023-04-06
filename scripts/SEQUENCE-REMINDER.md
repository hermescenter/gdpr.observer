## This is the sequence of commands you should try

```
scripts/country-processor.mjs --source rawlists/NGO--edri.txt --name edri
scripts/importer.mjs --source output/meta/edri-latest
scripts/collector.mjs --name edri
```
