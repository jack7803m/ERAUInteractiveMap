import { UpdateRequest } from 'shared/models/update-request.model';

// returns 400 bad request if request body is not a valid UpdateRequest
// returns 201 created if key not provided and value is valid (data created)
// returns 204 no content if key provided and value is valid (data updated)
export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    // json parse the request body
    let body: UpdateRequest;
    try {
        body = (await request.json()) as UpdateRequest;
    } catch (error) {
        return new Response('', { status: 400, statusText: 'Bad Request' });
    }

    if (!body.value)
        return new Response('', { status: 400, statusText: 'Bad Request' });

    // if key is not provided, generate a new key
    if (!body.key) {
        let newKey = crypto.randomUUID();
        await database.put(newKey, body.value);
        return new Response(newKey, { status: 201, statusText: 'Created' });
    }

    // if the key is provided but does not exist, return bad request :(
    if (database.get(body.key) === null) {
        return new Response('', { status: 400, statusText: 'Bad Request' });
    }

    // if the key is provided, update the value
    await database.put(body.key, body.value);

    return new Response('', { status: 204, statusText: 'No Content' });
}

// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    let body: UpdateRequest;
    try {
        body = (await request.json()) as UpdateRequest;
    } catch (error) {
        return new Response('', { status: 400, statusText: 'Bad Request' });
    }

    if (!body.key) {
        return new Response('', {
            status: 400,
            statusText: 'Bad Request',
        });
    }

    await database.delete(body.key);

    return new Response('', { status: 204, statusText: 'No Content' });
}
