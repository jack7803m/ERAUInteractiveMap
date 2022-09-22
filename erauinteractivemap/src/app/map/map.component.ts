import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor() {}

  public realBounds: L.LatLngBounds = new L.LatLngBounds([
    [29.18533793467103, -81.05725010075435],
    [29.19881398634449, -81.0374078389188],
  ]);

  public imageBounds: L.LatLngBounds = new L.LatLngBounds([
    [0, 0],
    [1700, 2200],
  ]);

  public options: L.MapOptions = {
    layers: [L.imageOverlay('assets/campus-map.png', this.imageBounds)],
    zoom: 17,
    zoomSnap: 0,
    crs: L.CRS.Simple,
    minZoom: -5.85,
    // maxZoom: 2,
  };

  ngOnInit(): void {}

  onMapReady(map: L.Map) {
    map.on('locationfound', (e) => {
      L.marker(this.translateRealToMap(e.latlng)).addTo(map);
      console.log(this.translateRealToMap(e.latlng));
    });
    map.locate();

    // L.marker([29.186611251392442, -81.05093742884416]).addTo(map);
  }

  onMapClick(e: L.LeafletMouseEvent) {
    console.log(e);
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
}
