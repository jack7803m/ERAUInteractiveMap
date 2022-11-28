import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { DatabaseSchema, Pin } from 'shared/models/database-schema.model';
import { ICanDeactivate } from 'src/app/_interfaces/ICanDeactivate.interface';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MapDataService } from 'src/app/_services/map-data.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit, ICanDeactivate {

  constructor(private auth: AuthService, private mapDataService: MapDataService, private adminService: AdminService, private toastr: ToastrService) { }

  mapData?: DatabaseSchema;
  radioValue: 'add' | 'edit' | '' = '';

  pinAddForm = {
    category: '',
    color: '',
    icon: '',
  }

  pinEditForm = {
    id: '',
    category: '',
    color: '',
    icon: '',
  }

  ngOnInit(): void {
    this.mapDataService.getMapData();
    this.mapDataService.mapData.subscribe((data) => {
      this.mapData = data;
    });

    // update the map data every minute
    setInterval(() => {
      this.mapDataService.getMapData();
    }, 60000);
  }

  canDeactivate(): boolean {
    return true;
  }

  radioChange(event: MatRadioChange) {
    this.radioValue = event.value;
  }

  onSubmitAdd() {
    this.adminService.createPinCategory(this.pinAddForm).subscribe({
      next: (data) => {
        if (this.mapData) {
          let id = data.id;
          this.mapData.pins.push({
            _id: id,
            category: this.pinAddForm.category,
            color: this.pinAddForm.color,
            icon: this.pinAddForm.icon,
          });
        }
        this.toastr.success("Pin added successfully.");
        this.pinAddForm = {
          category: '',
          color: '',
          icon: '',
        }
      },
      error: (error) => {
        this.toastr.error("Error adding pin.");
      }
    });
  }

  editValueChange() {
    if (this.mapData) {
      let pin = this.mapData.pins.find((p) => p._id.toString() === this.pinEditForm.id);
      if (pin) {
        this.pinEditForm.category = pin.category;
        this.pinEditForm.color = pin.color;
        this.pinEditForm.icon = pin.icon;
      }
    }
  }

  onSubmitEdit() {
    this.adminService.updatePinCategory({
      id: this.pinEditForm.id as any,
      category: this.pinEditForm.category,
      color: this.pinEditForm.color,
      icon: this.pinEditForm.icon,
    }).subscribe({
      next: (data) => {
        if (this.mapData) {
          let pin = this.mapData.pins.find((p) => p._id.toString() === this.pinEditForm.id);
          if (pin) {
            pin.category = this.pinEditForm.category;
            pin.color = this.pinEditForm.color;
            pin.icon = this.pinEditForm.icon;
          }
        }
        this.toastr.success("Pin updated successfully.");
      },
      error: (error) => {
        this.toastr.error("Error updating pin.");
      }
    });
  }
}
