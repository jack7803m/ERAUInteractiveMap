import {
    CreateBuildingPropertyRequest,
    UpdateBuildingPropertyRequest,
} from 'shared/models/update-request.model';
import * as Realm from 'realm-web';

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const createRequest =
        (await request.json()) as CreateBuildingPropertyRequest;

    let propertyData = createRequest.propertyData;
    propertyData._id = new Realm.BSON.ObjectId();

    // EXAMPLE:: $push { entrances: propertydata }
    let update: { $push: any } = { $push: {} };
    update.$push[`${createRequest.propertyName}`] = propertyData;

    await db
        .collection('buildings')
        .updateOne({ _id: { $oid: createRequest.buildingId } }, update);

    return new Response(JSON.stringify({ id: propertyData._id }), {
        status: 200,
        statusText: 'OK',
    });
}

export async function onRequestPut(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const updateRequest =
        (await request.json()) as UpdateBuildingPropertyRequest;

    // TODO: update database

    return new Response('', { status: 204, statusText: 'No Content' });
}

// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    // TODO: implement deletion

    return new Response('', { status: 204, statusText: 'No Content' });
}
