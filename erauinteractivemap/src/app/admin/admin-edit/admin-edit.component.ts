import { Component, OnInit } from '@angular/core';
import { ICanDeactivate } from 'src/app/_interfaces/ICanDeactivate.interface';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit, ICanDeactivate {

  constructor() { }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return true;
  }

}
