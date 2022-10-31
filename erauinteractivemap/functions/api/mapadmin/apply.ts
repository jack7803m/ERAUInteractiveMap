import { ApplyChangesRequest } from 'shared/models/update-request.model';

// route: /api/mapadmin/apply
// the purpose of this function is to compare the old data to the new data and apply any changes in the database
// this function is called when the user clicks the "Apply Changes" button in the admin panel
// ! NOTE: this function does not create or delete anything. it only updates fields that already exist in the database
export async function onRequestPost(context: any): Promise<Response> {
    const { request, env, params, waitUntil, next, data } = context;

    const db: globalThis.Realm.Services.MongoDBDatabase = data.db;

    const changeRequest = (await request.json()) as ApplyChangesRequest;

    // compare the old data to the new data and apply any changes
    // * first check all the pins
    for (const oldPin of changeRequest.oldData.pins) {
        const updatedPin = changeRequest.newData.pins.find((pin) => {
            if (pin._id !== oldPin._id) {
                return false;
            }

            if (pin.category !== oldPin.category || pin.color !== oldPin.color || pin.icon !== oldPin.icon) {
                return true;
            }
            else {
                return false;
            }
        });

        if (!updatedPin) continue;

        // not awaiting the database call because we don't care about the result. hopefully it updates ¯\_(ツ)_/¯
        db.collection('pins').updateOne(
            {
                _id: { $oid: updatedPin._id },
            },
            {
                $set: {
                    category: updatedPin.category,
                    color: updatedPin.color,
                    icon: updatedPin.icon,
                },
            }
        );
    }

    // * next check all the buildings
    for (const oldBuilding of changeRequest.oldData.buildings) {
        const updatedBuilding = changeRequest.newData.buildings.find((building) => {
            if (building._id !== oldBuilding._id) {
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
    for (const oldBuilding of changeRequest.oldData.buildings) {
        const newBuilding = changeRequest.newData.buildings.find((building) => { return building._id === oldBuilding._id; });

        if (!newBuilding) continue; // this should never happen

        for (const oldProperty of oldBuilding.children) {
            const updatedProperty = newBuilding.children.find((property) => {
                if (property._id !== oldProperty._id) {
                    return false;
                }

                for (const key in Object.keys(property)) {
                    if ((property as any)[key] !== (oldProperty as any)[key]) {
                        return true;
                    }
                }

                return false;
            })

            if (!updatedProperty) continue;

            let update: { $set: any } = { $set: {} };
            update.$set['$[elem]'] = updatedProperty;

            // not awaiting the database call because we don't care about the result. hopefully it updates ¯\_(ツ)_/¯
            db.collection('buildings').updateOne(
                { _id: { $oid: newBuilding._id } },
                update,
                { arrayFilters: [{ 'elem._id': { $oid: updatedProperty._id } }] }
            );
        }

    }

    return new Response('', {
        status: 204,
        statusText: 'No Content',
    });
}