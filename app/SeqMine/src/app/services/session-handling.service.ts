import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CredentialValidationService, DataForCookie } from './credential-validation.service';

@Injectable({
  providedIn: 'root'
})
export class SessionHandlingService {

  // Initialize and declare variables.
  isLoggedIn: Boolean = false;

  validationError!: string | null;
  constructor(
    private route: Router,
    private cookieService: CookieService,
    private credenService: CredentialValidationService,

  ) { }


  // Try to validate credens and login the user.
  // After successful login create cookie.
  doLogin(inputUsername: string, inputPassword: string) {
    const validationResult: Observable<DataForCookie> = this.credenService.validateLoginCredens(
      inputUsername,
      inputPassword
    );

    validationResult.subscribe((res) => {
        console.log(res);

        if (Object.keys(res).length > 0) {
          this.cookieService.set(
            res.username,
            res.role,
            { expires: 3 }
          );
          this.isLoggedIn = true;
          this.route.navigate(['/home']);
        } else {
          this.validationError = 'Invalid username or password.';
        }
    });
  }

  // Delete cookie and logout.
  public doLogOut() {
    this.cookieService.deleteAll();
    this.isLoggedIn = false;
  }
}
