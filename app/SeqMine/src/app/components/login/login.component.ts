import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionHandlingService } from '../../services/session-handling.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private route: Router,
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
   * Get username from session data.
   * @return string
   * */
  get loggedInUsername(): string {
    return this.sessionService.userData.username;
  }

  /*
   * Get role from session data.
   * @return string
   * */
  get loggedInRole(): string {
    return this.sessionService.userData.role;
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
   * server if the credentials are correct or not.
   * If correct, then initializes the the session.
   * @return void
   * */
  doLogin() {
    this.sessionService.login(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );
  }
}
