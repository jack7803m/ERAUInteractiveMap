import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, timeInterval } from 'rxjs';
import { ICanDeactivate } from '../_interfaces/ICanDeactivate.interface';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<ICanDeactivate> {
  canDeactivate(
    component: ICanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(component.canDeactivate());
    // sleep 5 seconds

    return false;
  }
}
