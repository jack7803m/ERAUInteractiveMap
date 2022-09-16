import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { RotatingMapOptions } from 'leaflet-rotate-map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() { }

  layer =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 25, attribution: '...' });
  center = L.latLng({ lat: 29.188943840305406, lng: -81.04962629704922 });

  map = L.map('map', {rotate:true})
    .addLayer(this.layer)
    .setView(this.center);

  public options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 25, attribution: '...' })
    ],
    zoom: 17,
    center: L.latLng({ lat: 29.188943840305406, lng: -81.04962629704922 }),
  }

  ngOnInit(): void {
  }

}
