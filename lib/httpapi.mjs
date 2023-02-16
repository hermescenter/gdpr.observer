/*
 * this file implement the express API, it is 
 * invoked by `bin/backend.mjs` */
import _ from 'lodash';
import d from 'debug';
const debug = d('lib:http-api');
import cors from 'cors';

import { getDBData, getDBBatches } from './database.mjs';

function handleError(error, req, res, name) {
  /* this is the function invoked if any API 
   * trigger an exception, it is responsible
   * of handling a safe return value via HTTP */
  debug("Unhandled error in %s: %s", name, error.message);
  res.status(500);
  res.send(error.message);
}

async function getBatches(db, req, res) {
  /* this function returns all the available batches
   * in the database, and information on when the 
   * first and last test has been made */
  const batches = await getDBBatches(db);
  return batches;
}

async function getData(db, req, res) {
  /* we've to parse req.params batch and day */
  const data = await getDBData(db, req.params);
  return data;
}

/* BELOW, the routes as loaded by utils/express.js */
export async function serveDataByBatch(db, expressApp) {
  expressApp.get('/api/data/:batch/:day', cors(), async (req, res) => {
    try {
      const f = _.partial(getData, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      handleError(error, req, res, "getData");
    }
  });
}

export async function getBatchList(db, expressApp) {
  expressApp.get('/api/batches', cors(), async (req, res) => {
    try {
      const f = _.partial(getBatches, db);
      const retval = await f(req, res);
      res.json(retval);
    } catch(error) {
      handleError(error, req, res, "getBatches");
    }
  });
}

export const routes = [ serveDataByBatch, getBatchList];

debug("Configured %d routes", routes.length);
