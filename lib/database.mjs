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
  /* this function checks via `distinct` the campaigns available
   * and then return the last recorded evidence for each of it */
  const retv = [];
  let uniq = [];

  const client = await connect(db);
  const sources = ['localStorage', 'cookies', 'hosts'];

  try {

    /* this first step is to pick the names of the `campaign` */
    for(const cname of sources) {
      const l = await client
        .db()
        .collection(cname)
        .distinct("campaign");

      for (const campaign of l) {
        /* nested loop, for every collection from 'sources' check 
         * each campaign how many entries there are */
        const amount = await client.db().collection(cname).count({campaign});

        const d = await client
          .db()
          .collection(cname)
          .find({campaign: campaign})
          .sort({acquiredAt: -1})
          .limit(1)
          .toArray();
       
        let lastActivity;
        if(!d.length) {
          debug("Missing `hosts` entries with {campaign: '%s'}", campaign);
          lastActivity = null;
        } else {
          lastActivity = _.first(d).acquiredAt;
        }

        retv.push({
          collection: cname,
          campaign,
          amount,
          lastActivity,
        });
      }

    }

    await client.close();
    return retv;
  } catch(error) {
    debug("Error in getDBBatches: %s", error.message);
    await client.close();
    throw new Error(`getDBBatches: ${error.message}`);
  }
}

export async function getDBCampaign(db, payload) {
  const name = payload.name;
  const client = await connect(db);

  try {
    const retv = await client
      .db()
      .collection('campaigns')
      .find({campaign: name })
      .toArray();
    
    await client.close();
    /* small cleaning from _id */
    return _.map(retv, function(e) {
      _.unset(e, '_id');
      return e;
    });

  } catch(error) {
    debug("Error in getCampaign: %s", error.message);
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
      .find({campaign: batch, acquiredAt: { "$gte": lastd }})
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
          ..._.pick(le, ['id', 'siteId', 'image', 'description', 'geoip', 'country' ]),
          day,
          type: 'localStorage'
        });
      });
      return memo;
    }, retv);

    const cookies = await client
      .db()
      .collection('cookies')
      .find({campaign: batch, acquiredAt: { "$gte": lastd }})
      .toArray();

    retv = _.reduce(cookies, function(memo, ce) {
      const paths = ce.evidence.split('/');
      paths.pop();
      const site = paths.pop();
      _.each(ce.cookies, function(cookie, number) {
        memo.push({
          cookieNumber: number,
          site,
          ..._.pick(ce, ['id', 'siteId', 'image', 'description', 'geoip', 'country', 'name']),
          cookieName: cookie.name,
          cookieDomain: cookie.domain,
          firstParty: cookie.firstPartyStorage,
          day,
          type: 'cookies'
        });
      });
      return memo;
    }, retv);

    const hosts = await client
      .db()
      .collection('hosts')
      .find({campaign: batch, acquiredAt: { "$gte": lastd }})
      .toArray();

    retv = _.reduce(hosts, function(memo, he) {
      const paths = he.evidence.split('/');
      paths.pop();
      const site = paths.pop();
      _.each(he.hosts.requests.thirdParty, function(tp) {
        memo.push({
          site,
          ..._.pick(he, ['id', 'siteId', 'image', 'description', 'geoip', 'country' ]),
          day,
          thirdParty: tp,
          type: 'thirdParty'
        });
      });
      return memo;
    }, retv);

    await client.close();
    return _.groupBy(retv, 'type');

  } catch(error) {
    await client.close();
    console.log(error);
    throw new Error(`getDBData: ${error.message}`);
  }
}
