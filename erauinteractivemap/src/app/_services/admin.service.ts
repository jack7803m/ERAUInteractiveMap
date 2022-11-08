import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DatabaseSchema } from 'shared/models/database-schema.model';
import { CreateBuildingPropertyRequest, CreateBuildingRequest, CreatePinCategoryRequest, DeleteBuildingPropertyRequest, UpdatePinCategoryRequest } from 'shared/models/update-request.model';
import { AuthService } from './auth.service';
import * as Realm from 'realm-web';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private auth: AuthService, private toastr: ToastrService) { }

  private authenticate() {
    // if (!this.auth.isAuthenticated()) {
    //   this.toastr.error("You must be logged in to make changes. Please refresh and login.");
    //   throw new Error("User not authenticated");
    // }
  }

  applyChanges(mapData: DatabaseSchema) {
    this.authenticate();

    return this.http.post('/api/mapadmin/apply', mapData);
  }

  createBuilding(building: CreateBuildingRequest) {
    this.authenticate();

    return this.http.post<{ id: any }>('/api/mapadmin/buildings', building);
  }

  createBuildingProperty(property: CreateBuildingPropertyRequest) {
    this.authenticate();

    return this.http.post<{ id: any }>('/api/mapadmin/buildingproperty', property);
  }

  deleteBuildingProperty(property: DeleteBuildingPropertyRequest) {
    this.authenticate();

    return this.http.delete('/api/mapadmin/buildingproperty', { body: property });
  }

  createPinCategory(pin: CreatePinCategoryRequest) {
    this.authenticate();

    return this.http.post<{ id: any }>('/api/mapadmin/pins', pin);
  }

  updatePinCategory(pin: UpdatePinCategoryRequest) {
    this.authenticate();

    return this.http.put('/api/mapadmin/pins', pin);
  }

  deletePinCategory(pinId: any) {
    this.authenticate();

    return this.http.delete('/api/mapadmin/pins', { body: { id: pinId } });
  }
}



