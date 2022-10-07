import {
    CreateBuildingRequest,
    UpdateBuildingRequest,
} from 'shared/models/update-request.model';

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const createRequest = (await request.json()) as CreateBuildingRequest;

    const resultDocument = await db.collection('buildings').insertOne({
        name: createRequest.name,
        description: createRequest.description,
        location: createRequest.location,
        category: createRequest.category,
    });

    return new Response(JSON.stringify({ id: resultDocument.insertedId }), {
        status: 200,
        statusText: 'OK',
    });
}

export async function onRequestPut(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const updateRequest = (await request.json()) as UpdateBuildingRequest;

    await db
        .collection('buildings')
        .updateOne(
            { _id: {$oid: updateRequest.buildingId} },
            {
                $set: {
                    name: updateRequest.name,
                    description: updateRequest.description,
                    location: updateRequest.location,
                    category: updateRequest.category,
                },
            }
        );

    return new Response('', { status: 204, statusText: 'No Content' });
}

// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    // TODO: implement (building deletion probably won't be a necessary feature. if a building needs to be deleted, it can be done manually in the database)

    return new Response('', { status: 204, statusText: 'No Content' });
}
