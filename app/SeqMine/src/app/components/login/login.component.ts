import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialValidationService, DataForCookie } from '../../services/credential-validation.service';
import { SessionHandlingService } from '../../services/session-handling.service';
import { User } from '../../models/user.model';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private route: Router,
    private cookieService: CookieService,
    private credenService: CredentialValidationService,
    private sessionService: SessionHandlingService
  ) {}

  validationResult!: User | null;
  validationError!: string | null;

  /*
   * Check if the user logged in.
   * @return Boolean
   * */
  get isLoggedIn(): Boolean {
    return this.sessionService.isLoggedIn;
  }

  /*
   * Get username from cookie
   * @return string
   * */
  get loggedInUsername(): string {
    return Object.keys(this.cookieService.getAll())[0];
  }

  /*
   * Get role from cookie.
   * @return string
   * */
  get loggedInRole(): string {
    return Object.values(this.cookieService.getAll())[0];
  }

  // Initialize login FormGroup + FormControl.
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    file: new FormControl('', []),
  });

  ngOnInit() {
    if (this.isLoggedIn) {
      this.route.navigate(['/home']);
    }
  }

      /* this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value */

  // Try to validate credens and login the user.
  // After successful login create cookie.
  doLogin() {
    const validationResult: Observable<DataForCookie> = this.credenService.validateLoginCredens(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );

    validationResult.subscribe((res) => {

        if (Object.keys(res).length > 0) {
          this.cookieService.set(
            res.username,
            res.role,
            { expires: 3 }
          );
          this.sessionService.isLoggedIn = true;
          this.route.navigate(['/home']);
        } else {
          this.validationError = 'Invalid username or password.';
        }
    });
  }

  // Delete cookie and logout.
  public doLogOut() {
    this.cookieService.deleteAll();
    this.sessionService.isLoggedIn = false;
  }

}
