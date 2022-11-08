import { Component, EmbeddedViewRef, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { BuildingPropertyName } from 'shared/enums/database-schema.enum';
import { Building, BuildingChild, DatabaseSchema, Pin } from 'shared/models/database-schema.model';
import { ICanDeactivate } from 'src/app/_interfaces/ICanDeactivate.interface';
import { AdminService } from 'src/app/_services/admin.service';
import { MapDataService } from 'src/app/_services/map-data.service';


@Component({
    selector: 'app-admin-map',
    templateUrl: './admin-map.component.html',
    styleUrls: ['./admin-map.component.scss'],
})
export class AdminMapComponent implements OnInit, ICanDeactivate {
    constructor(private mapDataService: MapDataService, private adminService: AdminService, private toastr: ToastrService, private viewRef: ViewContainerRef) { }

    public readonly realBounds: L.LatLngBounds = new L.LatLngBounds([
        [29.185670171901748, -81.05683016856118],
        [29.198278013324593, -81.04355540378286],
    ]);

    public readonly imageBounds: L.LatLngBounds = new L.LatLngBounds([
        [0, 0],
        [1700, 1568],
    ]);

    private map?: L.Map;
    private oldData?: string; // this is ONLY to keep track of whether there are new changes in the database
    private mapData?: DatabaseSchema;
    changes: boolean = false;

    modalRadioValue: 'building' | 'child' | '' = '';
    pinCategories: Pin[] = [];
    buildings: Building[] = []; // TODO: update this when buildings are added
    childTypeEnum = Object.values(BuildingPropertyName);

    buildingAddForm = {
        name: '',
        description: '',
        category: ''
    }

    childAddForm = {
        building: '',
        name: '',
        type: '',
        description: '',
        category: ''
    }

    @ViewChild('modalFormTemplate') modalTemplate?: TemplateRef<any>;
    openModal?: EmbeddedViewRef<any>;

    userLocation?: L.Marker;
    userLocationRadius?: L.Circle;

    public options: L.MapOptions = {
        layers: [
            L.imageOverlay('assets/campus-map-trans.png', this.imageBounds),
            L.imageOverlay(
                'assets/campus-map-walkable-trans.png',
                this.imageBounds
            ),
        ],
        zoom: 17,
        zoomSnap: 0,
        crs: L.CRS.Simple,
        minZoom: -0.81,
        maxZoom: 2,
        maxBounds: this.imageBounds,
        maxBoundsViscosity: 0.95,
        attributionControl: false,
        zoomControl: false,
    };

    ngOnInit(): void {
        this.mapDataService.getMapData().subscribe((data) => {
            this.oldData = JSON.stringify(data);
            this.mapData = data;
            this.pinCategories = data.pins;
            this.buildings = data.buildings;

            // add all POIs to the map
            data.buildings.forEach((building) => {
                this.createBuildingMarker(building);
                building.children.forEach((child) => {
                    this.createChildMarker(child);
                });
            })
        });

        setInterval(() => {
            this.mapDataService.getMapData().subscribe((data) => {
                // cheap trick but easier than comparing every field
                if (JSON.stringify(data) !== this.oldData) {
                    this.toastr.warning("Map data has changed. Please refresh to see changes.");
                }
            })
        }, 120_000);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: BeforeUnloadEvent) {
        return this.canDeactivate();
    }

    canDeactivate(): boolean {
        if (this.changes) {
            return confirm("You have unsaved changes. Are you sure you want to leave?");
        }

        return true;
    }

    // do all configuration here that is not done in the template/options
    // this basically includes 'subscribing' to map events with map.on()
    onMapReady(map: L.Map) {
        this.map = map;

        map.on('locationfound', (e) => {
            const loc = this.translateRealToMap(e.latlng);
            if (this.userLocation) {
                this.userLocation.setLatLng(loc);
                this.userLocationRadius?.setLatLng(loc);
            } else {
                this.userLocation = L.marker(loc).addTo(map);
                this.userLocationRadius = L.circle(loc, {
                    radius: e.accuracy,
                }).addTo(map);
            }
        });
        map.on('locationerror', (e: L.ErrorEvent) => {
            // TODO: better error handling
            alert(e.message + e.code);
            map.stopLocate();
        });

        // make a border around the map using a rectangle
        L.rectangle(this.imageBounds, {
            color: 'black',
            weight: 3,
            fill: false,
        }).addTo(map);
    }

    onMapClick(e: L.LeafletMouseEvent) {
        console.log(e);
    }

    addMarkerToMap() {
        if (!this.map || !this.modalTemplate) return;

        this.openModal = this.viewRef.createEmbeddedView(this.modalTemplate)
    }

    closeModal() {
        if (!this.openModal) return;

        this.openModal.destroy();
    }

    applyChanges() {
        if (this.mapData && this.changes) {
            console.log("Applying changes")
            this.adminService.applyChanges(this.mapData).subscribe({
                next: () => {
                    this.changes = false;
                    this.toastr.success("Changes applied successfully!");
                    this.mapDataService.getMapData().subscribe((data) => {
                        this.oldData = JSON.stringify(data);
                        this.mapData = data;
                        this.pinCategories = data.pins;
                        this.buildings = data.buildings;

                        // clear all markers, then add all POIs to the map
                        this.map?.eachLayer((layer) => {
                            if (layer instanceof L.Marker) {
                                layer.remove();
                            }
                        });
                        data.buildings.forEach((building) => {
                            this.createBuildingMarker(building);
                            building.children.forEach((child) => {
                                this.createChildMarker(child);
                            });
                        });
                    });
                },
                error: (err) => {
                    this.toastr.error("Error applying changes: " + err);
                }
            });
        }
    }

    radioChange(event: MatRadioChange) {
        this.modalRadioValue = event.value;
    }

    onSubmitAddBuilding() {
        if (!this.map || !this.mapData) return; // should never happen

        const location = this.map.getCenter();

        this.adminService.createBuilding({
            name: this.buildingAddForm.name,
            description: this.buildingAddForm.description,
            category: this.buildingAddForm.category as any,
            location,
        }).subscribe({
            next: (data) => {
                let newBuilding: Building = {
                    _id: data.id,
                    name: this.buildingAddForm.name,
                    description: this.buildingAddForm.description,
                    category: this.buildingAddForm.category as any,
                    location,
                    children: []
                }

                this.mapData?.buildings.push(newBuilding);
                this.buildings.push(newBuilding);

                this.createBuildingMarker(newBuilding);

                this.buildingAddForm = {
                    name: '',
                    description: '',
                    category: ''
                }
                this.closeModal();
            }, error: (err) => {
                this.toastr.error("Error creating building: " + err);
            }
        });
    }

    onSubmitAddChild() {
        if (!this.map || !this.mapData) return; // should never happen

        const location = this.map.getCenter();

        this.adminService.createBuildingProperty({
            buildingId: this.childAddForm.building as any,
            propertyData: {
                name: this.childAddForm.name,
                description: this.childAddForm.description,
                category: this.childAddForm.category as any,
                location,
                type: this.childAddForm.type as any,
            }
        }).subscribe({
            next: (data) => {
                let newChild: BuildingChild = {
                    _id: data.id,
                    name: this.childAddForm.name,
                    description: this.childAddForm.description,
                    category: this.childAddForm.category as any,
                    location,
                    type: this.childAddForm.type as any
                }

                this.mapData?.buildings.find(b => b._id.toString() === this.childAddForm.building)?.children.push(newChild);

                this.createChildMarker(newChild);

                this.childAddForm = {
                    name: '',
                    description: '',
                    category: '',
                    building: '',
                    type: ''
                }
                this.closeModal();
            }, error: (err) => {
                this.toastr.error("Error creating child: " + err);
            }
        });
    }

    private createBuildingMarker(building: Building) {
        const marker = L.marker(building.location, { draggable: true, autoPan: true }).addTo(this.map!);

        marker.on('dragend', (e: L.DragEndEvent) => {
            this.changes = true;
            const newLocation = e.target.getLatLng();
            let b = this.mapData?.buildings.find(b => b._id.toString() === building._id.toString());
            if (b) {
                b.location = newLocation;
            } else {
                this.toastr.error("Error updating building location");
            }
        });
    }

    private createChildMarker(child: BuildingChild) {
        const marker = L.marker(child.location, { draggable: true, autoPan: true }).addTo(this.map!);

        marker.on('dragend', (e: L.DragEndEvent) => {
            this.changes = true;
            const newLocation = e.target.getLatLng();
            // find the child in the map data
            let b = this.mapData?.buildings.find(b => b.children.find(c => c._id.toString() === child._id.toString()));
            let c = b?.children.find(c => c._id.toString() === child._id.toString());

            if (c) {
                c.location = newLocation;
            } else {
                this.toastr.error("Error updating child location");
            }
        });
    }

    // translate a real world lat/lng to a map lat/lng (in pixels from bottom left)
    private translateRealToMap(position: L.LatLng): L.LatLng {
        // as long as this works, don't touch it :)
        const mapLeft = this.imageBounds.getWest();
        const mapBottom = this.imageBounds.getSouth();
        const mapTop = this.imageBounds.getNorth();
        const mapRight = this.imageBounds.getEast();

        const mapWidth = mapRight - mapLeft;
        const mapHeight = mapTop - mapBottom;

        const realLeft = this.realBounds.getWest();
        const realBottom = this.realBounds.getSouth();
        const realTop = this.realBounds.getNorth();
        const realRight = this.realBounds.getEast();

        const realWidth = realRight - realLeft;
        const realHeight = realTop - realBottom;

        let x = ((position.lng - realLeft) / realWidth) * mapWidth;
        let y = ((position.lat - realBottom) / realHeight) * mapHeight;

        return new L.LatLng(y, x);
    }
}
