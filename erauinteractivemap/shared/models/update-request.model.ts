import * as Realm from 'realm-web';
import { BuildingPropertyName } from 'shared/enums/database-schema.enum';
import {
    BuildingProperty,
    PointLocation,
} from './database-schema.model';

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

export class UpdateBuildingRequest {
    buildingId: Realm.BSON.ObjectId;
    name: string;
    description: string;
    location: PointLocation;
    category: Realm.BSON.ObjectId;

    public constructor(
        buildingId: Realm.BSON.ObjectId,
        name: string,
        description: string,
        location: PointLocation,
        category: Realm.BSON.ObjectId
    ) {
        this.buildingId = buildingId;
        this.name = name;
        this.description = description;
        this.location = location;
        this.category = category;
    }
}

export class CreateBuildingPropertyRequest {
    buildingId: Realm.BSON.ObjectId;
    propertyName: BuildingPropertyName;
    propertyData: BuildingProperty;

    public constructor(
        buildingId: Realm.BSON.ObjectId,
        property: BuildingPropertyName,
        propertyData: BuildingProperty
    ) {
        this.buildingId = buildingId;
        this.propertyName = property;
        this.propertyData = propertyData;
    }
}

export class UpdateBuildingPropertyRequest {
    buildingId: Realm.BSON.ObjectId;
    propertyName: BuildingPropertyName;
    propertyId: Realm.BSON.ObjectId;
    propertyData: BuildingProperty;

    public constructor(
        buildingId: Realm.BSON.ObjectId,
        propertyName: BuildingPropertyName,
        propertyId: Realm.BSON.ObjectId,
        propertyData: BuildingProperty
    ) {
        this.buildingId = buildingId;
        this.propertyName = propertyName;
        this.propertyId = propertyId;
        this.propertyData = propertyData;
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

    constructor(
        id: Realm.BSON.ObjectId,
        category: string,
        color: string,
        icon: string
    ) {
        this.id = id;
        this.category = category;
        this.color = color;
        this.icon = icon;
    }
}
