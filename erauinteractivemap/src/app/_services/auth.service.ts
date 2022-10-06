import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            if (this.isAuthenticated()) {
                observer.error("User is already logged in.");
                observer.complete();
            }

            this.http
                .post('/api/login', {
                    username: username,
                    password: password,
                })
                .subscribe({
                    next: (response: any) => {
                        if (response.token) {
                            localStorage.setItem('token', response.token);
                            observer.next(true);
                        } else {
                            observer.next(false);
                        }
                        observer.complete();
                    },
                    error: (error: HttpErrorResponse) => {
                        observer.error(error);
                        observer.complete();
                    },
                });
        });
    }

    isAuthenticated(): boolean {
        // if local storage has a non-expired token, return true
        const token = localStorage.getItem('token');
        const helper = new JwtHelperService();

        if (token && !helper.isTokenExpired(token)) {
            return true;
        } else {
            return false;
        }
    }
}
