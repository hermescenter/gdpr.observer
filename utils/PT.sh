#!/usr/bin/env bash

# Portugal government
scripts/country-processor.mjs --source rawlists/PT-government-1.txt --name PTg --sessions 100 &
scripts/country-processor.mjs --source rawlists/PT-government-2.txt --name PTg --sessions 100 &
scripts/country-processor.mjs --source rawlists/PT-government-3.txt --name PTg --sessions 100 &

# Portugal municipalities
scripts/country-processor.mjs --source rawlists/PT-municipality-1.txt --name PTm --sessions 100 &
scripts/country-processor.mjs --source rawlists/PT-municipality-2.txt --name PTm --sessions 100 &

# Portugal schools
scripts/country-processor.mjs --source rawlists/PT-schools-1.txt --name PTs --sessions 100 &
scripts/country-processor.mjs --source rawlists/PT-universities.txt --name PTs --sessions 100 &

echo "done!"
# Import in the DB now
#scripts/importer.mjs --source output/metai/PTg-latest --name PTg
#cripts/importer.mjs --source output/metai/PTm-latest --name PTm
#cripts/importer.mjs --source output/metai/PTs-latest --name PTs
