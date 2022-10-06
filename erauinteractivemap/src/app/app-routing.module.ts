import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { MapComponent } from './map/map.component';
import { UnauthGuard } from './_guards/unauth.guard';

const routes: Routes = [
  { path: '', component: MapComponent, },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: '**',
    component: MapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
