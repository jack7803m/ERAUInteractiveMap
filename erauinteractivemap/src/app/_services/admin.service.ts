import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatabaseSchema } from 'shared/models/database-schema.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private auth: AuthService, private toastr: ToastrService) { }

  applyChanges(oldData: DatabaseSchema, newData: DatabaseSchema): void {
    // TODO: implement this

  }
}
