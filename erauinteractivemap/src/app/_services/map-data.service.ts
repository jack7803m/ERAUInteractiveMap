import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DatabaseSchema } from '../../../shared/models/database-schema.model';

@Injectable({
    providedIn: 'root',
})
export class MapDataService {

    constructor(private http: HttpClient, private toastr: ToastrService) { }

    public mapData: ReplaySubject<DatabaseSchema> = new ReplaySubject<DatabaseSchema>(1);

    getMapData(): void {
        this.http.get<DatabaseSchema>('/api/mapdb').subscribe({
            next: (data) => {
                this.mapData.next(data);
            },
            error: (err) => {
                this.toastr.error('Error loading map data.');
            },
        }
        );
    }
}
