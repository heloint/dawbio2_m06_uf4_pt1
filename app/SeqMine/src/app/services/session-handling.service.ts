import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialValidationService } from './credential-validation.service';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

export type SessionData = {
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  token: string;
  accessToken: string;
  refreshToken: string;
};

@Injectable({
  providedIn: 'root',
})
export class SessionHandlingService {
  // Initialize and declare variables.
  isLoggedIn: Boolean = false;
  #BASE_URL: string = 'http://localhost:3000';
  validationError!: string | null;
  userData: SessionData = {
    role: '',
    username: '',
    first_name: '',
    last_name: '',
    token: '',
    accessToken: '',
    refreshToken: '',
  };
  internalErrorMsg: string | null = null;

  constructor(
    private route: Router,
    private credenService: CredentialValidationService,
    private http: HttpClient
  ) {}

  /* Prepares a random token for the login session.
   * @return string
   * */
  private createToken(): string {
    const rand = function () {
      return Math.random().toString(36).substr(2); // remove `0.`
    };
    return rand() + rand();
  }

  /* Validates username and password against the "database"
   * and registers the session token if all good.
   * @param username string
   * @param password string
   * @return  Observable<SessionData>
   * */
  private validateLoginCredens(
    usernameParam: string,
    passwordParam: string,
    token: string
  ): Observable<SessionData> {
    return this.http
      .post<SessionData>(this.#BASE_URL + '/login', {
        username: usernameParam,
        password: passwordParam,
        token: token,
      })
      .pipe(shareReplay());
  }

  /* Send a request to destroy the session register corresponding to the argument token value.
   * @param username string
   * @param password string
   * @return Observable<SessionData>
   * */
  private destroySessionToken(): Observable<SessionData> {
    return this.http.post<SessionData>(this.#BASE_URL + '/logout', {
      refreshToken: localStorage['refreshToken'],
    });
  }

  /* Try to validate credens and login the user.
   * After successful login saves token in localStorage.
   * @param inputUsername string
   * @param inputPassword string
   * @return void
   **/
  login(inputUsername: string, inputPassword: string): void {
    const validationResult: Observable<SessionData> = this.validateLoginCredens(
      inputUsername,
      inputPassword,
      this.createToken()
    );

    validationResult.subscribe({
        next: (res) => {
          if (Object.keys(res).length > 0) {
            localStorage['token'] = res.accessToken;
            localStorage['refreshToken'] = res.refreshToken;

            this.userData = res;
            this.isLoggedIn = true;
            this.route.navigate(['/home']);
          } else {
            this.validationError = 'Invalid username or password.';
          }
        },
        error: (error) => {
            if (error.status !== 403) {
                this.internalErrorMsg = 'An internal error has occured.';
            } else {
                this.route.navigate(['/home']);
            }
        }
    });
  }

  /* Validates session token against the "database"
   * and registers the session token if all good.
   * @param username string
   * @param password string
   * @return Observable<SessionData>
   * */
  public validateSessionToken(): Observable<SessionData> {
    return this.http.post<SessionData>(this.#BASE_URL + '/sessionValidation', {
      token: localStorage['token'],
    });
  }

  /* Validates session token against the "database"
   * and registers the session token if all good.
   * @param username string
   * @param password string
   * @return Observable<SessionData>
   * */
  private validateRefreshToken(): Observable<SessionData> {
    return this.http.post<SessionData>(this.#BASE_URL + '/refreshSession', {
      refreshToken: localStorage['refreshToken'],
    });
  }

  /* Send a request to the server,
   * to generate an updated accessToken with the refreshToken.
   * @return { void }
   * */
  public tryUpdateToken() {
      const refreshValidationResult: Observable<SessionData> =
        this.validateRefreshToken();

      refreshValidationResult.subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            this.isLoggedIn = true;
            this.userData = res;

            localStorage['token'] = res.accessToken;
            localStorage['refreshToken'] = res.refreshToken;
          }
        },
        (err) => {
          this.isLoggedIn = false;
          localStorage.clear();
          this.route.navigate(['/home']);
        }
      );
  }


  /* Try to validate the session token of the user.
   * If the token is valid and still alive, then continue with the session.
   * @param inputUsername string
   * @param inputPassword string
   * @return void
   **/
  validateSession() {
    if (
      localStorage['token'] !== undefined &&
      localStorage['refreshToken'] !== undefined
    ) {
      const token: string = localStorage['token'];
      const refreshToken: string = localStorage['refreshToken'];
      const validationResult: Observable<SessionData> =
        this.validateSessionToken();

      validationResult.subscribe({
        next: (res) => {
          if (Object.keys(res).length > 0) {
            this.isLoggedIn = true;
            this.userData = res;
          }
        },
        error: (err) => {
            this.tryUpdateToken();
        }
      });
    }
  }

  // Delete session token and logout.
  public doLogOut() {
    this.destroySessionToken().subscribe({
      next: (result) => {},
      error: (error) => {},
    });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.isLoggedIn = false;
  }
}
