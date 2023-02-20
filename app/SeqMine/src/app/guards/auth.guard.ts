import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
  Data,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionHandlingService } from '../services/session-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private sessionHandler: SessionHandlingService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    const params: Data = route.data;

    // Check login requirement.
    // This must apply for all routes which uses this guard.
    if (this.sessionHandler.isLoggedIn !== params['onlyLoggedIn']) {
      this.router.navigate(['/home']);
      return false;
    }

    // Check role requirement.
    // This is an optional parameter.
    if (params['rolesOnly'] !== undefined) {
      if (!params['rolesOnly'].includes(this.sessionHandler.userData.role)) {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}
