import * as Realm from 'realm-web';

export interface DatabaseSchema {
    buildings: Building[];
    pins: Pin[];
}

export interface Building extends globalThis.Realm.Services.MongoDB.Document {
    _id: Realm.BSON.ObjectId;
    name: string;
    description: string;
    location: PointLocation;
    category: Realm.BSON.ObjectId;
    children: BuildingChild[];
}

export interface PointLocation {
    lat: number;
    lng: number;
}

export interface BuildingProperty {
    _id: Realm.BSON.ObjectId;
    location: PointLocation;
    category: Realm.BSON.ObjectId;
    comment: string;
}

export interface BuildingChild extends BuildingProperty {
    type: string | undefined;
    name: string;
}

export interface Pin extends globalThis.Realm.Services.MongoDB.Document {
    _id: Realm.BSON.ObjectId;
    category: string;
    color: string;
    icon: string;
}
