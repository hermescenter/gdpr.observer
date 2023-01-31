import { MongoClient } from 'mongodb';

export async function connect(config = {}) {
    if(!config.uri)
        config.uri = 'mongodb://127.0.0.1:27017/etpir';

    const client = new MongoClient(config.uri);
    await client.connect();
    return client;
}

