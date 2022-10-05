import {
    CreatePinCategoryRequest,
    UpdatePinCategoryRequest,
} from 'shared/models/update-request.model';

// TODO: add some sort of basic authentication

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const createPinRequest = (await request.json()) as CreatePinCategoryRequest;

    // TODO: add to database

    // TODO: return _id of new pin category
    return new Response('', { status: 204, statusText: 'No Content' });
}

export async function onRequestPut(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const updatePinRequest = (await request.json()) as UpdatePinCategoryRequest;

    // TODO: update database

    return new Response('', { status: 204, statusText: 'No Content' });
}

// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    // TODO: implement delete

    return new Response('', { status: 204, statusText: 'No Content' });
}
