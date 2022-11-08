import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { MapDataService } from '../_services/map-data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    constructor(private toastr: ToastrService, private mapDataService: MapDataService) {}

    public readonly realBounds: L.LatLngBounds = new L.LatLngBounds([
        [29.185670171901730, -81.05683016856100],
        [29.198278013324596, -81.0435554037837],
    ]);

    public readonly imageBounds: L.LatLngBounds = new L.LatLngBounds([
        [0, 0],
        [1700, 1568],
    ]);

    private map?: L.Map;

    userLocation?: L.Marker;
    userLocationRadius?: L.Circle;

    mapPng: L.Layer = L.imageOverlay('assets/images/vectorymappyNowalk.svg', this.realBounds);
    walkPng: L.Layer = L.imageOverlay('assets/images/walky.svg', this.realBounds);
    satelite: L.Layer = L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png');




    public options: L.MapOptions = {
        layers: [
            this.mapPng,
            this.walkPng,
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



    ngOnInit(): void { }

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
        console.log(ev);
    }

    zoomIn() {
        this.map?.zoomIn();
    }

    zoomOut() {
        this.map?.zoomOut();
    }
}
