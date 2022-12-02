import {
    CreateBuildingPropertyRequest,
    DeleteBuildingPropertyRequest,
} from 'shared/models/update-request.model';
import * as Realm from 'realm-web';

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const createRequest =
        (await request.json()) as CreateBuildingPropertyRequest;

    let propertyData = createRequest.propertyData as any;
    propertyData.kid = new Realm.BSON.ObjectId();
    propertyData.kid = propertyData.kid.toString();

    // EXAMPLE:: $push { entrances: propertydata }
    let update: { $push: any } = { $push: {} };
    update.$push[`children`] = propertyData;

    await db
        .collection('buildings')
        .updateOne({ _id: { $oid: createRequest.buildingId } }, update);

    return new Response(JSON.stringify({ id: propertyData.kid }), {
        status: 200,
        statusText: 'OK',
    });
}

// TODO: return bad request if request is bad
// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const deleteRequest = (await request.json()) as DeleteBuildingPropertyRequest;

    // EXAMPLE:: $pull { entrances: { kid: propertyId } }
    let update: { $pull: any } = { $pull: {} };
    update.$pull[`children`] = { kid: deleteRequest.propertyId };

    await db
        .collection('buildings')
        .updateOne({ _id: { $oid: deleteRequest.buildingId } }, update);

    return new Response('', { status: 204, statusText: 'No Content' });
}
