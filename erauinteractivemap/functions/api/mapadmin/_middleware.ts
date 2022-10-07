import jwt from '@tsndr/cloudflare-worker-jwt';
import { getDatabaseConnection } from 'functions/mongodb';

export const onRequest = [authentication, database];

async function authentication(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const token = request.headers.get('Authorization');

    if (!(await verifyAuthentication(token, env.JWT_SECRET))) {
        return new Response('Unauthorized', {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    return next();
}

async function database(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db = await getDatabaseConnection(
        env.MONGODB_APPID,
        env.MONGODB_TOKEN
    );

    if (!db) {
        return new Response('Error getting database connection.', {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }

    data.db = db;
    return next();
}

async function verifyAuthentication(
    token: string,
    secret: string
): Promise<boolean> {
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2) {
        return false;
    }

    const tokenType = tokenParts[0].toLocaleLowerCase();
    const tokenValue = tokenParts[1];

    if (tokenType !== 'bearer') {
        return false;
    }

    return await jwt.verify(tokenValue, secret);
}
