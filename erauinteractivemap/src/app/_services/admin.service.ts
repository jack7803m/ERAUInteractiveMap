import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatabaseSchema } from 'shared/models/database-schema.model';
import { ApplyChangesRequest } from 'shared/models/update-request.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private auth: AuthService, private toastr: ToastrService) { }

  applyChanges(oldData: DatabaseSchema, newData: DatabaseSchema): void {
    if (!this.auth.isAuthenticated()) {
      this.toastr.error("You must be logged in to make changes. Please refresh and login.");
      return;
    }

    this.http.post('/api/admin/apply', new ApplyChangesRequest(oldData, newData)).subscribe({
      next: () => {
        this.toastr.success("Changes applied successfully.");
      },
      error: (err) => {
        this.toastr.error("An error occurred while applying changes. Please try again.");
        console.log(err);
      }
    });

  }


}
