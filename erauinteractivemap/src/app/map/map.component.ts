import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    constructor() {}

    public readonly realBounds: L.LatLngBounds = new L.LatLngBounds([
        [29.185670171901748, -81.05683016856118],
        [29.198278013324593, -81.04355540378286],
    ]);

    public readonly imageBounds: L.LatLngBounds = new L.LatLngBounds([
        [0, 0],
        [1700, 1568],
    ]);

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
    };

    ngOnInit(): void {}

    // do all configuration here that is not done in the template/options
    // this basically includes 'subscribing' to map events with map.on()
    onMapReady(map: L.Map) {
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
    }

    onMapClick(e: L.LeafletMouseEvent) {
        console.log(e);
    }

    // translate a real world lat/lng to a map lat/lng (in pixels from bottom left)
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
}
