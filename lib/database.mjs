/*
 * this file implement the I/O for the database,
 * invoked by httpapi.mjs
 * 
 * The functions at the moment are two, equivalent 
 * to the two API implemented. 
 */

import _ from 'lodash';
import moment from 'moment';
import { connect } from './mongodb.mjs';
import L from 'debug';
const debug = L('lib:database');

export async function getDBBatches(db) {
  const client = await connect(db);
  let retv = { collections: {}, lastActivity: {} }, uniq = [];
  const sources = ['localStorage', 'cookies', 'beacons'];

  try {

    for(const cname of sources) {
      const l = await client
        .db()
        .collection(cname)
        .distinct("country");

      _.set(retv.collections, cname, l);
      uniq = _.uniq(_.concat(uniq, l));
    }

    debug("Last activity from %j via 'beacons'", uniq);

    for(const country of uniq) {
      const d = await client
        .db()
        .collection("beacons")
        .find({country})
        .sort({when: -1})
        .limit(1)
        .toArray();

      _.set(retv.lastActivity, country, _.first(d).when);
    }

    await client.close();
    return retv;
  } catch(error) {
    debug("Error in getDBBatches: %s", error.message);
    await client.close();
    throw new Error(`getDBBatches: ${error.message}`);
  }
}

export async function getDBData(db, payload) {
  const client = await connect(db);
  try {
    const { batch, day } = payload;
    const lastd = new Date(moment(day).startOf('day'));
    let retv = [];
    const localStorage = await client
      .db()
      .collection('localStorage')
      .find({country: batch, when: { "$gte": lastd }})
      .toArray();
    
    retv = _.reduce(localStorage, function(memo, le) {
      const paths = le.evidence.split('/');
      paths.pop();
      const site = paths.pop();
      _.each(le.localStorage, function(val, tpd) {
        memo.push({
          inclusions: _.keys(val).length,
          site,
          tpinclusion: tpd,
          country: le.country,
          id: le.id,
          day,
          type: 'localStorage'
        });
      });
      return memo;
    }, retv);

    const cookies = await client
      .db()
      .collection('cookies')
      .find({country: batch, when: { "$gte": lastd }})
      .toArray();

    retv = _.reduce(cookies, function(memo, ce) {
      const paths = ce.evidence.split('/');
      paths.pop();
      const site = paths.pop();
      _.each(ce.cookies, function(cookie, number) {
        memo.push({
          cookieNumber: number,
          site,
          id: ce.id,
          cookieName: cookie.name,
          cookieDomain: cookie.domain,
          firstParty: cookie.firstPartyStorage,
          day,
          type: 'cookies'
        });
      });
      return memo;
    }, retv);

    const beacons = await client
      .db()
      .collection('beacons')
      .find({country: batch, when: { "$gte": lastd }})
      .toArray();

    retv = _.reduce(beacons, function(memo, be) {
      const paths = be.evidence.split('/');
      paths.pop();
      const site = paths.pop();
      _.each(be.beacons, function(beacon) {
        memo.push({
          site,
          id: be.id,
          day,
          ..._.pick(beacon, ['occurrances', 'url', 'filter', 'listName']),
          type: 'beacons'
        });
      });
      return memo;
    }, retv);

    await client.close();
    return retv;

  } catch(error) {
    await client.close();
    throw new Error(`getDBData: ${error.message}`);
  }
}

