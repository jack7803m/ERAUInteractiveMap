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
    @Output() onDirection: EventEmitter<Building | BuildingChild> = new EventEmitter();

    pinCategories?: Pin[];

    ngOnInit(): void {
        this.mapDataService.mapData.subscribe(data => {
            this.pinCategories = data.pins;
        });

        if (this.editable) {
            this.markerData = {
                _parent: "" as any,
                kid: "" as any,
                name: "",
                description: "",
                location: {
                    lat: 0,
                    lng: 0
                },
                category: "" as any,
                type: undefined
            }
        }
    }

    onDirections(): void {
        console.log(this.markerData);
        this.onDirection.emit(this.markerData);
    }

    onDelete(): void {
        this.deleteMarker.emit(this.markerData);
    }
}
