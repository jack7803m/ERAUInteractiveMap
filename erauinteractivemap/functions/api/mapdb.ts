import { getDatabaseConnection } from 'functions/mongodb';

export async function onRequestGet(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db = await getDatabaseConnection(env.MONGODB_APPID, env.MONGODB_TOKEN);

    if (!db) {
        return new Response('Error getting database connection.', {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }

    let allBuildings = await db.collection('buildings').find();
    let allPins = await db.collection('pins').find();

    let allData = {
        buildings: allBuildings,
        pins: allPins,
    };

    return new Response(JSON.stringify(allData), {
        status: 200,
        statusText: 'OK',
    });
}