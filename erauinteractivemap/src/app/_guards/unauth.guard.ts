import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    // this is a guard that prevents a user from accessing a route if they are already logged in
    // possibly redundant? the auth guard does the *exact* opposite of this but whatever
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (!this.authService.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/admin/map']);
            return false;
        }
    }
}
