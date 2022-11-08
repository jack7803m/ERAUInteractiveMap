import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AdminMapComponent } from './admin/admin-map/admin-map.component';
import { ToastrModule } from 'ngx-toastr';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    declarations: [AppComponent, MapComponent, AdminLoginComponent, AdminEditComponent, AdminMapComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LeafletModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: [
                    'localhost:4200',
                    'erauinteractivemap.pages.dev',
                ],
            },
        }),
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatCardModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
