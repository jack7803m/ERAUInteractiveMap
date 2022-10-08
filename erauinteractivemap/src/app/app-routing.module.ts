import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminMapComponent } from './admin/admin-map/admin-map.component';
import { MapComponent } from './map/map.component';
import { AuthGuard } from './_guards/auth.guard';
import { UnauthGuard } from './_guards/unauth.guard';

const routes: Routes = [
    { path: '', component: MapComponent },
    {
        path: 'admin/login',
        component: AdminLoginComponent,
        canActivate: [UnauthGuard],
    },
    {
        path: 'admin/edit',
        component: AdminEditComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'admin/map',
        component: AdminMapComponent,
        canActivate: [AuthGuard],
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
export class AppRoutingModule { }
