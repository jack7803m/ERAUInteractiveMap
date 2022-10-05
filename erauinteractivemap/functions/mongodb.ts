import * as Realm from "realm-web";

export type Document = globalThis.Realm.Services.MongoDB.Document;

export async function getDatabaseConnection(MONGODB_APPID: string, MONGODB_TOKEN: string): Promise<globalThis.Realm.Services.MongoDBDatabase | undefined>{
    try {
        
        const App: Realm.App = new Realm.App(MONGODB_APPID);
        const credentials = Realm.Credentials.apiKey(MONGODB_TOKEN);
        return (await App.logIn(credentials))
        .mongoClient('mongodb-atlas')
        .db('erauinteractivemap');
    } catch (err) {
        console.debug(err);
        return undefined;
    }
}