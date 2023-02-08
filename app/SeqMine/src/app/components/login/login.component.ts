import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialValidationService } from '../../services/credential-validation.service';
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
  ) {}

  validationResult!: User | null;
  validationError!: string | null;

  /*
   * Check if the user logged in.
   * @return Boolean
   * */
  get isLoggedIn(): Boolean {
    return this.credenService.isLoggedIn;
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

  // Try to validate credens and login the user.
  // After successful login create cookie.
  doLogin() {
    this.validationResult = this.credenService.validateLoginCredens(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );

    // TODO: Later uncomment it, when the backend is ready to do the login.
    /* if (this.validationResult !== null) {
      this.cookieService.set(
        this.validationResult.username,
        this.validationResult.role,
        { expires: 3 }
      );
      this.credenService.isLoggedIn = true;
      this.route.navigate(['/events']);
    } else {
      this.validationError = 'Invalid username or password.';
      // Pass
    } */
  }
}
