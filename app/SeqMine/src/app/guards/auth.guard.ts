import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { SessionHandlingService } from '../services/session-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private sessionHandler: SessionHandlingService,
    private router: Router,
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree

  {


    if (this.sessionHandler.isLoggedIn) {
      this.router.navigate(['/home']);
      return false;
    }
    console.log(this.sessionHandler.isLoggedIn);

    return true;
  }
}
