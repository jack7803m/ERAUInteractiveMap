export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    let fakeData = "asdalsdkm";

    await database.put('data', JSON.stringify(fakeData));1

    return new Response('', { status: 204, statusText: 'No Content' });
}

export async function onRequestGet(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    let ex_data = await database.get('data');

    return new Response(ex_data, { status: 200, statusText: 'OK' });
}