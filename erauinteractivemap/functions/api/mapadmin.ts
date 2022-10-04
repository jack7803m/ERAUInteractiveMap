export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    // procedure:
    // 1. check if the key in the request body exists in the database
    //   a. if it does, modify the value
    // 2. if it doesn't, add the key and value to the database
    // 3. return the new value

    // json parse the request body
    const body = await request.json();

    // check if the key exists in the database
    const keyExists = (await database.get(body.key)) !== null;

    // if the key exists, modify the value
    if (keyExists) {
        await database.put(body.key, body.value);
    } else {
        // if the key doesn't exist, ensure the modify flag is true and add the key and value to the database
        if (body.modify) {
            await database.put(body.key, body.value);
        }
    }

    return new Response('', { status: 204, statusText: 'No Content' });
}

export async function onRequestGet(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    // procedure:
    // 1. list all keys in the database
    // 2. return everything in the database

    // list all keys in the database
    const keys = await database.list();
    let finalData = '';
    if (!keys.list_complete) {
    }

    return new Response(finalData, { status: 200, statusText: 'OK' });
}
