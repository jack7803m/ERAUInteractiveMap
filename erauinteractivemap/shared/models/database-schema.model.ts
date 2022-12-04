import * as Realm from 'realm-web';
import { BuildingPropertyName } from 'shared/enums/database-schema.enum';

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

export interface BuildingChild {
    _parent: Realm.BSON.ObjectId;
    kid: Realm.BSON.ObjectId;
    type: BuildingPropertyName | undefined;
    name: string;
    description: string;
    location: PointLocation;
    category: Realm.BSON.ObjectId;
}

export interface Pin extends globalThis.Realm.Services.MongoDB.Document {
    _id: Realm.BSON.ObjectId;
    category: string;
    color: string;
    icon: string;
}
