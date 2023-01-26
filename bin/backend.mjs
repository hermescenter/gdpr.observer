#!node_modules/.bin/zx


import logger from 'debug';
const debug = logger('bin:backend');


debug("Setting up database and indexes...");

import { ensureIndex } from '../lib/build-index.mjs';

const dbSettings = await fs.readJSON('./config/database.json');
debug("Loaded scheduled-db settings %O", dbSettings);

debug("Verifying and configuring databases presence and indexes");
if(!await ensureIndex(dbSettings, 'backend')) {
    console.log("Database fatal error (scheduled)");
    process.exit(1);
}

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
    await route(dbSettings.backend, expressApp);
}

expressApp.get('/health', (req, res) => {
    debug("Health check from [%s]: OK", req.ip);
    res.send('OK');
});

debug("HTTP server ready");


