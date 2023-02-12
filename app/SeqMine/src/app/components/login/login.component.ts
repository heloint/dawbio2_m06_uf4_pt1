import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialValidationService} from '../../services/credential-validation.service';
import { SessionHandlingService } from '../../services/session-handling.service';
import { User } from '../../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private route: Router,
    private cookieService: CookieService,
    private sessionService: SessionHandlingService
  ) {}

  validationResult!: User | null;

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

  /*
   * Get validation error message from the sessionService.
   * @return string
   * */
  get validationErrorMessage(): string | null {
    return this.sessionService.validationError;
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

  /* Send the credentials for validation to sessionService, who will consult with the
   * server if the credentials are correct or not. If correct, then initializes the cookies of the session.
   * @return void
   * */
  doLogin() {
    this.sessionService.login(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );
  }

  /* Delete cookie and logout.
   * @return void
   **/
  doLogOut() {
    this.cookieService.deleteAll();
    this.sessionService.isLoggedIn = false;
  }
}
