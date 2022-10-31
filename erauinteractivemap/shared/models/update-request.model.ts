import * as Realm from 'realm-web';
import { BuildingPropertyName } from 'shared/enums/database-schema.enum';
import { BuildingProperty, DatabaseSchema, PointLocation } from './database-schema.model';

export class ApplyChangesRequest {
    public oldData: DatabaseSchema;
    public newData: DatabaseSchema;

    public constructor(oldData: DatabaseSchema, newData: DatabaseSchema) {
        this.oldData = oldData;
        this.newData = newData;
    }
}

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

export class DeleteBuildingPropertyRequest {
    buildingId: Realm.BSON.ObjectId;
    propertyName: BuildingPropertyName;
    propertyId: Realm.BSON.ObjectId;

    public constructor(
        buildingId: Realm.BSON.ObjectId,
        propertyName: BuildingPropertyName,
        propertyId: Realm.BSON.ObjectId
    ) {
        this.buildingId = buildingId;
        this.propertyName = propertyName;
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