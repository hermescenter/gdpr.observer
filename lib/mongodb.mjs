import { MongoClient } from 'mongodb';

async function connect(config = {}) {
    if(!config.uri)
        config.uri = 'mongodb://localhost/etpir-default';

    console.log(config);

    const client = new MongoClient(config.uri);
    await client.connect();
    return client;
}

export default connect;