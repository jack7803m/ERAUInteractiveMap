// route: /api/mapadmin/apply
// the purpose of this function is to compare the old data to the new data and apply any changes in the database
// this function is called when the user clicks the "Apply Changes" button in the admin panel

import { Building, DatabaseSchema, Pin } from "shared/models/database-schema.model";

// ! NOTE: this function does not create or delete anything. it only updates fields that already exist in the database
export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const newData = (await request.json()) as DatabaseSchema;

    // go fetch the old data from the database
    let allBuildings = await db.collection('buildings').find() as Building[];

    let oldData: DatabaseSchema = {
        buildings: allBuildings,
        pins: [],
    };

    // compare the old data to the new data and apply any changes
    // * next check all the buildings
    for (const oldBuilding of oldData.buildings) {
        const updatedBuilding = newData.buildings.find((building) => {
            if (building._id.toString() !== oldBuilding._id.toString()) {

                return false;
            }

            if (building.name !== oldBuilding.name || building.description !== oldBuilding.description || building.location !== oldBuilding.location || building.category !== oldBuilding.category) {
                return true;
            }
            else {
                return false;
            }
        });

        if (!updatedBuilding) continue;

        // not awaiting the database call because we don't care about the result. hopefully it updates ¯\_(ツ)_/¯
        db.collection('buildings').updateOne(
            {
                _id: { $oid: updatedBuilding._id },
            },
            {
                $set: {
                    name: updatedBuilding.name,
                    description: updatedBuilding.description,
                    location: updatedBuilding.location,
                    category: updatedBuilding.category,
                },
            }
        );
    }

    // * finally check all the building properties
    for (const oldBuilding of oldData.buildings) {
        const newBuilding = newData.buildings.find((building) => { return building._id.toString() === oldBuilding._id.toString(); });

        if (!newBuilding) continue; // this should never happen

        for (const oldChild of oldBuilding.children) {
            const updatedChild = newBuilding.children.find((newChild) => {
                if (newChild._id.toString() !== oldChild._id.toString()) {
                    return false;
                }

                for (let i = 0; i < Object.values(newChild).length; i++) {
                    const oldValue = Object.values(oldChild)[i];
                    const newValue = Object.values(newChild)[i];

                    if (oldValue !== newValue) {
                        return true;
                    }
                }

                return false;
            })

            if (!updatedChild) continue;

            let update: { $set: any } = { $set: {} };
            update.$set['children.$[elem]'] = updatedChild;

            // not awaiting the database call because we don't care about the result. hopefully it updates ¯\_(ツ)_/¯
            db.collection('buildings').updateOne(
                { _id: { $oid: newBuilding._id } },
                update,
                { arrayFilters: [{ 'elem._id': { $oid: updatedChild._id } }] }
            );
        }

    }

    return new Response('', {
        status: 204,
        statusText: 'No Content',
    });
}