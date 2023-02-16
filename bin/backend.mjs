#!node_modules/.bin/zx

import _ from 'lodash';
import logger from 'debug';
const debug = logger('bin:backend');

debug("Setting up database and indexes...");

import { ensureIndex } from '../lib/build-index.mjs';

const dbSettings = await fs.readJSON('./config/database.json');

const collections = _.compact(_.map(dbSettings, function(indexes, cName) {
    if(cName === 'mongodb') return null;
    // in the config file there can be various keys, here 
    // we have to filter the one that are not collections
    if(typeof indexes?.index !== typeof []) return null;
    // a collection has a list of index, check config/database.json
    indexes.name = cName;
    return indexes;
}));

debug("Verifying DB exists and configuring indexes");
for (const collection of collections) {
    if(!await ensureIndex(collection, dbSettings.mongodb)) {
        console.log("Database fatal error (GDPRo-backend)");
        process.exit(1);
    }
}

debug("Ensured indexes in %j and using %s as DB",
    _.map(collections, 'name'), dbSettings.mongodb);

debug("Database OK! Setting up HTTP server...");

import express from 'express';
import bodyParser from 'body-parser';
import { routes } from '../lib/httpapi.mjs';

const httpSettings = await fs.readJson('./config/http.json');
debug("Loaded HTTP settings %O", httpSettings.backend);

const expressApp = express();

expressApp.listen(httpSettings.backend.port, () => {
    debug("Binded sucessfully port %d", httpSettings.backend.port);
});

expressApp.use(bodyParser.json({ type: 'application/*+json', limit: '2mb' }));
expressApp.use(bodyParser.urlencoded({ extended: true }));

for (const route of routes) {
    await route(dbSettings.mongodb, expressApp);
}

expressApp.get('/api/health', (req, res) => {
    debug("Health check from [%s]: OK", req.ip);
    res.send('OK');
});

debug("HTTP server ready");


