import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';

@NgModule({
  declarations: [AppComponent, MapComponent, AdminEditComponent],
  imports: [BrowserModule, AppRoutingModule, LeafletModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
