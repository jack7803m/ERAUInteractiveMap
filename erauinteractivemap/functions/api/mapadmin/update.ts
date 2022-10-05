import { getDatabaseConnection } from 'functions/mongodb';
import { UpdateRequest } from 'shared/models/update-request.model';

// returns 400 bad request if request body is not a valid UpdateRequest
// returns 201 created if key not provided and value is valid (data created)
// returns 204 no content if key provided and value is valid (data updated)
export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db = await getDatabaseConnection(env.MONGODB_APPID, env.MONGODB_TOKEN);

    if (!db) {
        return new Response('Error getting database connection.', {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
    
    // TODO: 

    return new Response('', { status: 204, statusText: 'No Content' });
}

// returns 400 bad request if request body is not a valid UpdateRequest
export async function onRequestDelete(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;
    
    const db = await getDatabaseConnection(env.MONGODB_APPID, env.MONGODB_TOKEN);

    if (!db) {
        return new Response('Error getting database connection.', {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
    
    // TODO: 

    return new Response('', { status: 204, statusText: 'No Content' });
}

