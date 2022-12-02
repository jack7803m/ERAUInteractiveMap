import * as Realm from 'realm-web';
import { BuildingChild, DatabaseSchema, PointLocation } from './database-schema.model';

export class CreateBuildingRequest {
    name: string;
    description: string;
    location: PointLocation;
    category: Realm.BSON.ObjectId;

    public constructor(
        name: string,
        description: string,
        location: PointLocation,
        category: Realm.BSON.ObjectId
    ) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.category = category;
    }
}

export class CreateBuildingPropertyRequest {
    buildingId: Realm.BSON.ObjectId;
    propertyData: {
        _parent: Realm.BSON.ObjectId;
        name: string;
        description: string;
        type: string;
        category: Realm.BSON.ObjectId;
        location: PointLocation;
    };

    public constructor(
        buildingId: Realm.BSON.ObjectId,
        propertyData: any
    ) {
        this.buildingId = buildingId;
        this.propertyData = propertyData;
    }
}

export class DeleteBuildingPropertyRequest {
    buildingId: Realm.BSON.ObjectId;
    propertyId: Realm.BSON.ObjectId;

    public constructor(
        buildingId: Realm.BSON.ObjectId,
        propertyId: Realm.BSON.ObjectId
    ) {
        this.buildingId = buildingId;
        this.propertyId = propertyId;
    }
}

export class CreatePinCategoryRequest {
    category: string;
    color: string;
    icon: string;

    public constructor(category: string, color: string, icon: string) {
        this.category = category;
        this.color = color;
        this.icon = icon;
    }
}

export class UpdatePinCategoryRequest {
    id: Realm.BSON.ObjectId;
    category: string;
    color: string;
    icon: string;

    public constructor(id: Realm.BSON.ObjectId, category: string, color: string, icon: string) {
        this.id = id;
        this.category = category;
        this.color = color;
        this.icon = icon;
    }
}