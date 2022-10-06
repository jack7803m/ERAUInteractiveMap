import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.http.post('/api/login', { username: username, password: password }).subscribe((response: any) => {
                console.log(response);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    observer.next(true);
                } else {
                    observer.next(false);
                }
            });
        });
    }
}
