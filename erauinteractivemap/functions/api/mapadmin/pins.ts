import { CreatePinCategoryRequest } from 'shared/models/update-request.model';

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const createPinRequest = (await request.json()) as CreatePinCategoryRequest;

    const resultDocument = await db.collection('pins').insertOne({
        category: createPinRequest.category,
        color: createPinRequest.color,
        icon: createPinRequest.icon,
    });

    return new Response(JSON.stringify({ id: resultDocument.insertedId }), {
        status: 200,
        statusText: 'OK',
    });
}

export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const id = (await request.json()).id;

    await db.collection('pins').deleteOne({ _id: id });

    return new Response('', { status: 204, statusText: 'No Content' });
}
