export async function onRequest(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    try {
        return await next();
    } catch (err: any) {
        return new Response(`${err.message}\n${err.stack}`, {
            status: 500,
        });
    }
}
