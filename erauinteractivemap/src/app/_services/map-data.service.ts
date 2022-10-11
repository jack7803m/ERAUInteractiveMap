import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseSchema } from '../../../shared/models/database-schema.model';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {

  constructor(private http: HttpClient) { }

  // public mapData: DatabaseSchema = ;

  getMapData(): Observable<DatabaseSchema> {
    return this.http.get<DatabaseSchema>('/api/mapdb');
  }
}
