import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { DatabaseSchema } from '../../../shared/models/database-schema.model';

@Injectable({
    providedIn: 'root',
})
export class MapDataService {

    constructor(private http: HttpClient, private toastr: ToastrService) {}

    getMapData(): Observable<DatabaseSchema> {
        return this.http.get<DatabaseSchema>('/api/mapdb');
    }
}
