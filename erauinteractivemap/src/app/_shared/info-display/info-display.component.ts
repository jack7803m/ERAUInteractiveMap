import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Building, BuildingChild, Pin } from 'shared/models/database-schema.model';
import { MapDataService } from 'src/app/_services/map-data.service';

@Component({
  selector: 'app-info-display',
  templateUrl: './info-display.component.html',
  styleUrls: ['./info-display.component.scss']
})
export class InfoDisplayComponent implements OnInit {

  constructor(private mapDataService: MapDataService, private cdr: ChangeDetectorRef) { }

  @Input() markerData?: Building | BuildingChild;
  @Input() editable = false;

  @Output() deleteMarker: EventEmitter<Building | BuildingChild> = new EventEmitter();

  pinCategories?: Pin[];

  ngOnInit(): void {
    this.mapDataService.mapData.subscribe(data => {
      this.pinCategories = data.pins;
    });
  }

  onDirections(): void  {
    console.log(this.markerData);
  }

  onDelete(): void {
    this.deleteMarker.emit(this.markerData);
  }
}
