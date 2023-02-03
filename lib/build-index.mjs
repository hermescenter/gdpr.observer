/*
 * this file ensure there are the corret indexes, and it is 
 * executed at the start of every service that uses MongoDB.
 *
 * it has also the helpful side effect to verify if the DB 
 * is running or not.
 */

import { connect } from './mongodb.mjs';

import _ from 'lodash';
import d from 'debug';

const debug = d('lib:build-index');

export async function ensureIndex(indexes, db) {
  /* this function is invoked for each collection,
   * and potentially can run on a different DB */

  debug("Configuring mongodb index %s (%d)",
    indexes.name, indexes.index.length);

  try {
    const client = await connect(db);

    for(const index of indexes.index) {
      /* ignore who says that 'await' here is not necessary:
        IT IS */
      await client
        .db()
        .collection(indexes.name)
        .createIndex(index.key, index.options || {});
        /* TODO find the non-deprecated method */
      debug("Index %s OK", _.keys(index.key));
    }
    await client.close();
    return true;
  } catch(error) {
    debug("Error in createIndex: %s", error.message);
    await client.close();
    return null;
  }
}

