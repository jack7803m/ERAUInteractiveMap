import { Building, Point } from "src/app/models/mapData.model";

export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    let fakeData = new Array<Building>();
    let fakeBuilding = new Building(new Point(0, 0), "Building 1", "This is a building");
    fakeBuilding.entrances = new Array<Point>();
    fakeBuilding.entrances.push(new Point(0, 0));
    fakeBuilding.entrances.push(new Point(0, 1));
    fakeBuilding.entrances.push(new Point(0, 2));
    fakeBuilding.entrances.push(new Point(0, 3));

    fakeData.push(fakeBuilding);

    await database.put('data', JSON.stringify(fakeData));1

    return new Response('', { status: 204, statusText: 'No Content' });
}

export async function onRequestGet(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const database = env.KV_MAPDB as KVNamespace;

    let ex_data = await database.get('data');

    return new Response(ex_data, { status: 200, statusText: 'OK' });
}