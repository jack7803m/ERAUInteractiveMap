import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    toggleS: boolean = false;
    toggleW: boolean = true;
    toggleM: boolean = true;
    searchText: string = '';
    constructor() {
    }

    // the bounds of the map in real world coordinates
    private map?: L.Map;

    public readonly realBounds: L.LatLngBounds = new L.LatLngBounds([
        [29.185670171901730, -81.05683016856100],
        [29.198278013324596, -81.0435554037837],
    ]);

    public readonly imageBounds: L.LatLngBounds = new L.LatLngBounds([
        [0, 0],
        [1700, 1568],
    ]);

    userLocation?: L.Marker;
    userLocationRadius?: L.Circle;
    mapPng: L.Layer = L.imageOverlay('assets/images/vectorymappyNowalk.svg', this.realBounds);
    walkPng: L.Layer = L.imageOverlay('assets/images/walky.svg', this.realBounds);
    satelite: L.Layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');




    public options: L.MapOptions = {
        layers: [
            this.mapPng,
            this.walkPng,
        ],
        zoom: 17,
        zoomSnap: 0,
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
            // TODO: better error handling
            alert(e.message + e.code);
            map.stopLocate();

            // if high accuracy is not available, try again with low accuracy
            // TODO: determine what the error code is if failed to get high accuracy
            // if (e.code !== 1) {
            //   map.locate({ enableHighAccuracy: false, watch: true });
            //}
        });

        // make a border around the map using a rectangle
        L.rectangle(this.imageBounds, {
            color: 'black',
            weight: 3,
            fill: false,
        }).addTo(map);

        // high accuracy is ideal here because we want it to be as accurate as possible on the small section of map we have
        // watch is true because we want to keep updating the location
        map.locate({ enableHighAccuracy: true, watch: true });
        map.fitBounds(this.realBounds);

    }


    onMapClick(e: L.LeafletMouseEvent) {
        console.log(e.latlng);
    }

    toggleSatelite() {
        this.toggleS = !this.toggleS;
        if (this.toggleS) {
            this.map?.addLayer(this.satelite);
            console.warn("Statlite is on");
        } else {
            this.map?.removeLayer(this.satelite);
            console.warn("Statlite is off");
        }
    }

    toggleWalk() {
        this.toggleW = !this.toggleW;
        if (this.toggleW) {
            this.map?.addLayer(this.walkPng);
            console.warn("Walk is on");
        } else {
            this.map?.removeLayer(this.walkPng);
            console.warn("Walk is off");
        }
    }

    toggleMap() {
        this.toggleM = !this.toggleM;
        if (this.toggleM) {
            this.map?.addLayer(this.mapPng);
            console.warn("Map is on");
        } else {
            this.map?.removeLayer(this.mapPng);
            console.warn("Map is off");
        }
    }

    translateRealToMap(position: L.LatLng): L.LatLng {
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

    search() {
        console.log(this.searchText)
    }
}
