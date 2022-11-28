import { ChangeDetectorRef, Component, EmbeddedViewRef, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { BuildingPropertyName } from 'shared/enums/database-schema.enum';
import { Building, BuildingChild, DatabaseSchema, Pin } from 'shared/models/database-schema.model';
import { DeleteBuildingPropertyRequest } from 'shared/models/update-request.model';
import { ICanDeactivate } from 'src/app/_interfaces/ICanDeactivate.interface';
import { AdminService } from 'src/app/_services/admin.service';
import { MapDataService } from 'src/app/_services/map-data.service';


@Component({
    selector: 'app-admin-map',
    templateUrl: './admin-map.component.html',
    styleUrls: ['./admin-map.component.scss'],
})
export class AdminMapComponent implements OnInit, ICanDeactivate {
    constructor(private mapDataService: MapDataService, private adminService: AdminService, private toastr: ToastrService, private viewRef: ViewContainerRef, private cdr: ChangeDetectorRef) { }

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

    displayInfo: boolean = false;
    infoDisplayObject?: Building | BuildingChild;

    modalRadioValue: 'building' | 'child' | '' = '';
    pinCategories: Pin[] = [];
    buildings: Building[] = [];
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

    placeInfoForm = {
        id: '',
        name: '',
        description: '',
        category: '',
        type: '',
        child: false // child switch to tell if we need to show type or not
    }

    @ViewChild('modalFormTemplate') modalTemplate?: TemplateRef<any>;
    @ViewChild('editModalTemplate') editModalTemplate?: TemplateRef<any>;
    openModal?: EmbeddedViewRef<any>;

    userLocation?: L.Marker;
    userLocationRadius?: L.Circle;

    public options: L.MapOptions = {
        layers: [
            L.imageOverlay('assets/images/campus-map-trans.png', this.imageBounds),
            L.imageOverlay(
                'assets/images/campus-map-walkable-trans.png',
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
        this.mapDataService.getMapData();

        // we want to get/set the map data ONCE when the component is initialized - otherwise admin changes would be overwritten
        this.mapDataService.mapData.pipe(take(1)).subscribe(data => {
            this.oldData = JSON.stringify(data);
            this.mapData = data;
            this.pinCategories = data.pins;
            this.buildings = data.buildings;

            data.buildings.forEach(building => {
                this.createBuildingMarker(building);
                building.children.forEach(child => {
                    this.createChildMarker(child);
                });
            });
        });

        // we want to COMPARE the map data EVERY time it changes - if it changes, we warn the user
        this.mapDataService.mapData.subscribe((data) => {
            // cheap trick but easier than comparing every field
            if (JSON.stringify(data) !== this.oldData) {
                this.toastr.warning("Map data has changed. Please refresh to see changes.");
            }
        })

        setInterval(() => {
            this.mapDataService.getMapData();
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

    openPinEdit() {
        if (!this.map || !this.editModalTemplate) return;

        this.openModal = this.viewRef.createEmbeddedView(this.editModalTemplate);
    }

    closeModal() {
        if (!this.openModal) return;

        this.openModal.destroy();
    }

    applyChanges() {
        if (this.mapData) {
            console.log("Applying changes")
            this.adminService.applyChanges(this.mapData).subscribe({
                next: () => {
                    this.changes = false;
                    this.toastr.success("Changes applied successfully!");
                    this.mapDataService.getMapData()

                    // once we apply changes, we want to update the old data (ONCE)
                    this.mapDataService.mapData.pipe(take(1)).subscribe((data) => {
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
                    _parent: this.childAddForm.building as any,
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

    onSubmitEditPlace() {
        if (!this.mapData) return;
        // search through mapdata, find the building/child and update it
        if (this.placeInfoForm.child) {
            let child: BuildingChild | undefined = this.mapData.buildings.flatMap(b => b.children).find(c => c._id.toString() === this.placeInfoForm.id);

            if (child) {
                child.name = this.placeInfoForm.name;
                child.description = this.placeInfoForm.description;
                child.category = this.placeInfoForm.category as any;
                child.type = this.placeInfoForm.type as any;
            }
        } else {
            let building: Building | undefined = this.mapData.buildings.find(b => b._id.toString() === this.placeInfoForm.id);

            if (building) {
                building.name = this.placeInfoForm.name;
                building.description = this.placeInfoForm.description;
                building.category = this.placeInfoForm.category as any;
            }
        }
    }

    private createBuildingMarker(building: Building) {
        let pin = this.pinCategories?.find(pin => pin._id === building.category);
        let icon = pin?.icon;
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

        marker.on('click', (e: L.LeafletMouseEvent) => {
            this.infoDisplayObject = building;
            this.displayInfo = true;
            this.cdr.detectChanges();
            this.map?.setZoomAround(e.latlng, 18);
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

        marker.on('click', (e: L.LeafletMouseEvent) => {
            this.infoDisplayObject = child;
            this.displayInfo = true;
            this.cdr.detectChanges();
            this.map?.setZoomAround(e.latlng, 18);
        });
    }

    deleteMarker(marker: Building | BuildingChild): void {
        if (!marker._id) {
            this.toastr.error("Error deleting marker: no id");
            return;
        }

        if (marker.hasOwnProperty('children')) {
            this.toastr.error("Cannot delete buildings from the map! Need to do it directly in the database.");
            return;
        }

        this.deleteChild(marker as BuildingChild);
    }

    private deleteChild(marker: BuildingChild) {
        this.adminService.deleteBuildingProperty(new DeleteBuildingPropertyRequest(marker._parent, marker._id)).subscribe({
            next: (data) => {
                // remove from map data
                marker = marker as BuildingChild;
                let building = this.mapData?.buildings.find(b => b._id.toString() === marker._parent.toString());
                if (building) {
                    building.children = building.children.filter(c => c._id.toString() !== marker._id.toString());
                }

                this.toastr.success("Successfully deleted child");
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
