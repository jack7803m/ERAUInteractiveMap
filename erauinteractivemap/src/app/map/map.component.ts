import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { MapDataService } from '../_services/map-data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Building, BuildingChild, DatabaseSchema, Pin, PointLocation } from 'shared/models/database-schema.model';
import { InfoDisplayComponent } from '../_shared/info-display/info-display.component';


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    constructor(private toastr: ToastrService, private mapDataService: MapDataService, private cdr: ChangeDetectorRef) { }
    @ViewChild('infoDisplay') infoDisplay?: InfoDisplayComponent;


    public readonly realBounds: L.LatLngBounds = new L.LatLngBounds([
        [29.185670171901730, -81.05683016856100],
        [29.198278013324596, -81.0435554037837],
    ]);
    public readonly imageBounds: L.LatLngBounds = new L.LatLngBounds([
        [0, 0],
        [3421, 3222],
    ]);
    private map?: L.Map;
    userLocation?: L.Marker;
    userLocationRadius?: L.Circle;
    mapPng: L.Layer = L.imageOverlay('assets/images/map.png', this.imageBounds);
    //walkPng: L.Layer = L.imageOverlay('assets/images/campus-map-walkable-trans.png', this.imageBounds);
    satelite: L.Layer = L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png');
    mapData?: DatabaseSchema;
    pinCategories?: Pin[];
    buildings?: Building[];
    infoDisplayObject?: Building | BuildingChild;
    displayInfo: boolean = false;
    public options: L.MapOptions = {
        layers: [
            this.mapPng,
            //this.walkPng,
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


    dataSearch: { item_id: any, item_name: string }[] = [];
    // ALLOW FOR THE ITEMS TO BE SELECTED
    selectedItems = [
        { item_id: "", item_name: 'Campus Search' },
    ];
    dropDownSettings: IDropdownSettings = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_name',
        itemsShowLimit: 10,
        allowSearchFilter: true,
        closeDropDownOnSelection: true,
        noDataAvailablePlaceholderText: 'No Data :(',
    };

    ngOnInit(): void {
        this.mapDataService.getMapData();
    }

    // do all configuration here that is not done in the template/options
    // this basically includes 'subscribing' to map events with map.on()
    onMapReady(map: L.Map) {

        this.mapDataService.mapData.subscribe((data) => {
            this.mapData = data;
            this.pinCategories = data.pins;
            this.buildings = data.buildings;
            data.buildings.forEach(building => {
                if (building.name !== "Campus") {
                    this.createBuildingMarker(building);
                }
                building.children.forEach(child => {
                    this.createChildMarker(child);
                })
            })
            this.populateSearchData(data);
        })

        this.map = map;
        map.on('click', () => {
            this.displayInfo = false;
            this.cdr.detectChanges();
        });
        map.on('locationfound', (e) => {
            const loc = this.translateRealToMap(e.latlng); 4

            // if the user is outside the map, then remove the marker and radius
            if (!this.imageBounds.contains(loc)) {
                this.userLocation?.remove();
                this.userLocationRadius?.remove();
                this.userLocation = undefined;
                this.userLocationRadius = undefined;
                this.toastr.error('You are outside the map bounds. Please use the locate button once you are on campus.');
                this.map?.stopLocate();
                return;
            }

            // if the user is inside the map, then either create the marker and radius or update the position of the existing ones
            if (this.userLocation) {
                this.userLocation.setLatLng(loc);
                this.userLocationRadius?.setLatLng(loc);
            } else {
                this.userLocation = L.marker(loc).addTo(map);
                this.userLocationRadius = L.circle(loc, {
                    radius: e.accuracy,
                }).addTo(map);
                this.map?.setZoomAround(loc, 18);
            }
        });
        map.on('locationerror', (e: L.ErrorEvent) => {
            this.toastr.error("Please enable location services to use this feature.", "Location Error");
            map.stopLocate();
        });

        // make a border around the map using a rectangle
        L.rectangle(this.imageBounds, {
            color: 'black',
            weight: 3,
            fill: false,
        }).addTo(map);
    }

    onMapLocate() {
        if (!this.userLocation) {
            // high accuracy is ideal here because we want it to be as accurate as possible on the small section of map we have
            // watch is true because we want to keep updating the location
            this.map?.locate({ enableHighAccuracy: true, watch: true });
        }
    }

    onZoomIn() {
        this.map?.zoomIn();
    }

    onZoomOut() {
        this.map?.zoomOut();
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

    onItemSelect(ev: any) {
        let b = this.buildings?.find(building => building._id === ev.item_id);
        if (b) {
            this.onClick(b);
            return;
        }

        this.buildings?.forEach(building => {
            let c = building.children.find(child => child.kid === ev.item_id);
            if (c) {
                this.onClick(c);
                return;
            }
        })
    }

    createBuildingMarker(building: Building) {
        const marker = L.marker(building.location, { zIndexOffset: 100 }).addTo(this.map!);

        //GET ICON FROM BUILDING PIN CATAGORY
        const icon = this.pinCategories?.find((pin) => pin._id === building.category)?.icon;

        marker.setIcon(L.icon({
            iconUrl: 'assets/pins/' + icon,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        }));

        marker.on('click', (e: L.LeafletMouseEvent) => {
            this.onClick(building);
        });
    }

    createChildMarker(child: BuildingChild) {
        const marker = L.marker(child.location).addTo(this.map!);

        const icon = this.pinCategories?.find((pin) => pin._id === child.category)?.icon;

        marker.setIcon(L.icon({
            iconUrl: 'assets/pins/' + icon,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        }));

        marker.on('click', (e: L.LeafletMouseEvent) => {
            this.onClick(child);
        });
    }

    onClick(b: Building | BuildingChild) {
        this.infoDisplayObject = b;
        this.displayInfo = true;
        this.cdr.detectChanges();
        this.map?.setZoomAround(this.pointToLatLng(b.location), 18);
    }

    populateSearchData(data: any) {
        data.buildings.forEach((building: Building) => {
            if (building.name !== "Campus") {
                this.dataSearch.push({ item_id: building._id, item_name: building.name });
            }
            building.children.forEach((child: BuildingChild) => {
                this.dataSearch.push({ item_id: child.kid, item_name: child.name });
            })
        })

        this.dataSearch = [...this.dataSearch];
    }

    pointToLatLng(point: PointLocation): L.LatLng {
        return new L.LatLng(point.lat, point.lng);
    }
}
