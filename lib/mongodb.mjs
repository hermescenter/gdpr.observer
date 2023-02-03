import _ from 'lodash';
import { MongoClient } from 'mongodb';
import L from 'debug';
const debug = L('lib:mongodb');

const DEFAULT = 'mongodb://127.0.0.1:27017/etpir-default';

export async function connect(config) {
    if(!config || !_.startsWith(config, 'mongodb://')) {
        debug("Variable mongodb (%s) is invalid, using DEFAULT [%s]", config, DEFAULT);
        config = DEFAULT;
    }

    const client = new MongoClient(config);
    await client.connect();
    return client;
}

