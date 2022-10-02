export async function onRequestGet(context: any): Promise<Response> {
    return new Response('Hello World!', { status: 200, statusText: 'OK' });
}