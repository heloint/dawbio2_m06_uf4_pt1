import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
  Data,
} from '@angular/router';
import { Observable, of} from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
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

    return this.sessionHandler.validateSessionToken().pipe(
        map(user => {

            // If token returns request, then user is logged in.
            // If "onlyLoggedIn" set false, then we block access.
            if (params['onlyLoggedIn'] !== undefined) {
              if (params['onlyLoggedIn'] === false) {
                this.router.navigate(['/home']);
                return false;
              }
            }


            // Check role requirement.
            // This is an optional parameter.
            if (params['rolesOnly'] !== undefined) {
              if (!params['rolesOnly'].includes(user.role)) {
                this.router.navigate(['/home']);
                return false;
              }
            }

            return true;
        }),
        // If error occurs, then return to home.
        catchError(err => {

            // If token returns error, then user isn't logged in.
            // If "onlyLoggedIn" set false, then we let the access.
            if (params['onlyLoggedIn'] !== undefined) {
              if (params['onlyLoggedIn'] === false) {
                return of(true);
              }
            }

            this.router.navigate(['/home']);
            return of(false);
        })
    );
  }
}
