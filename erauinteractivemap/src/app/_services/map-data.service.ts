import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { DatabaseSchema } from '../../../shared/models/database-schema.model';

@Injectable({
    providedIn: 'root',
})
export class MapDataService {
    public mapData: Subject<DatabaseSchema> =
        new Subject<DatabaseSchema>();

    constructor(private http: HttpClient, private toastr: ToastrService) {}

    getMapData(): Observable<DatabaseSchema> {
        let request = this.http.get<DatabaseSchema>('/api/mapdb');

        request.subscribe({
            next: (data) => {
                this.mapData.next(data);
                this.mapData.complete();
            },
            error: (err) => {
                this.toastr.error(err)
            },
        });

        return request;
    }
}
