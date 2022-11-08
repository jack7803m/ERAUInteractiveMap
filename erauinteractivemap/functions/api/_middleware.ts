export async function onRequest(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    try {
        return next();
    } catch (err) {
        return new Response(JSON.stringify(err), {
            status: 500,
            statusText: 'Internal Server Error',
        });
    }
}
