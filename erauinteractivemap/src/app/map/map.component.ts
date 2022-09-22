import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor() {}

  public imageBounds: L.LatLngBounds = new L.LatLngBounds([
    [29.185661557151334, -81.05657440053801],
    [29.198075957881052, -81.03988631844526],
  ]);

  public bounds: L.LatLngBounds = new L.LatLngBounds([
    [0, 0],
    [1700, 2200],
  ]);

  public options: L.MapOptions = {
    layers: [
      L.imageOverlay('assets/campus-map.png', this.bounds),
    ],
    zoom: 17,
    zoomSnap: 0,
    crs: L.CRS.Simple,
    minZoom: -5.85,
    // maxZoom: 2,
  };

  ngOnInit(): void {
  }

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
    let mapLeft = 0;
    let mapBottom = 0;
    let mapTop = 1700;
    let mapRight = 2200;

    let realLeft = 29.185661557151334;
    let realBottom = -81.05657440053801;
    let realTop = -81.03988631844526;
    let realRight = 29.198075957881052;

    let realWidth = realRight - realLeft;
    let realHeight = realTop - realBottom;

    let mapWidth = mapRight - mapLeft;
    let mapHeight = mapTop - mapBottom;

    let x = ((position.lat - realLeft) / realWidth) * mapWidth;
    let y = ((position.lng - realBottom) / realHeight) * mapHeight;

    return new L.LatLng(x, y);
  }

  // 29.185661557151334, -81.05657440053801
  // 29.198075957881052, -81.03988631844526
}
