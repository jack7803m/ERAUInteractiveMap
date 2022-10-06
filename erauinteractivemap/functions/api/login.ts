import jwt from '@tsndr/cloudflare-worker-jwt';
import * as bcrypt from 'bcryptjs';
import { getDatabaseConnection } from 'functions/mongodb';

export async function onRequestPost(context: any) {
    const { request, env, params, waitUntil, next, data } = context;

    const db = await getDatabaseConnection(env.MONGODB_APPID, env.MONGODB_TOKEN);

    if (!db) {
        return new Response('Error getting database connection.', {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }

    const loginRequest = await request.json();

    const user = await db.collection('users').findOne({ username: loginRequest.username });

    if (!user) {
        return new Response('Invalid username or password.', {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    if (await bcrypt.compare(loginRequest.password, user.password)) {
        return new Response('Invalid username or password.', {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const token = await jwt.sign( { username: loginRequest.username, exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)) }, env.JWT_SECRET );

    return new Response(JSON.stringify({ token: token }), { status: 200, statusText: 'OK' });
}
