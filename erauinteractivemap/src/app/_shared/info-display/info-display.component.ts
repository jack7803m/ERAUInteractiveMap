import { Component, Input, OnInit } from '@angular/core';
import { Building, BuildingChild } from 'shared/models/database-schema.model';
import { MapDataService } from 'src/app/_services/map-data.service';

@Component({
  selector: 'app-info-display',
  templateUrl: './info-display.component.html',
  styleUrls: ['./info-display.component.scss']
})
export class InfoDisplayComponent implements OnInit {

  @Input() pinData?: Building | BuildingChild;

  constructor(private mapDataService: MapDataService) { }

  ngOnInit(): void {
  }

}
