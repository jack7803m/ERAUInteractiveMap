import { v5 } from 'uuid';

export async function onRequestGet(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    // procedure:
    // 1. list all keys in the database
    // 2. return everything in the database

    // list all keys in the database
    const keys = await getNextKeys(database);
    let allData: any = {};
    for (let key of keys) {
        let value = await database.get(key);
        allData[key] = value;
    }
    return new Response(JSON.stringify(allData), {
        status: 200,
        statusText: 'OK',
    });
}

async function getNextKeys(
    database: KVNamespace,
    cursor?: string
): Promise<string[]> {
    const keys = await database.list({ cursor: cursor });
    let finalKeys: string[] = keys.keys.map((key) => key.name);
    if (!keys.list_complete && keys.cursor) {
        let remainingKeys = await getNextKeys(database, keys.cursor);
        finalKeys = finalKeys.concat(remainingKeys);
    }
    return finalKeys;
}

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;
    
    // seed data for testing
    for (let i = 0; i < 100; i++) {
        await database.put(crypto.randomUUID(), 'test' + i);
    }

    return new Response('');
}
