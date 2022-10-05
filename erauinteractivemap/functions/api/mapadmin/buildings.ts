import {
    CreateBuildingRequest,
    UpdateBuildingRequest,
} from 'shared/models/update-request.model';

// TODO: add some sort of basic authentication

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const createRequest = (await request.json()) as CreateBuildingRequest;

    // TODO: add to database

    // TODO: return _id of new building
    return new Response('', { status: 204, statusText: 'No Content' });
}

export async function onRequestPut(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const updateRequest = (await request.json()) as UpdateBuildingRequest;

    // TODO: update database

    return new Response('', { status: 204, statusText: 'No Content' });
}

// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    // TODO: implement (building deletion probably won't be a necessary feature. if a building needs to be deleted, it can be done manually in the database)

    return new Response('', { status: 204, statusText: 'No Content' });
}
