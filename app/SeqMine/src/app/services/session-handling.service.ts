import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CredentialValidationService } from './credential-validation.service';
import { HttpClient } from '@angular/common/http';

export type DataForCookie = {
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  token: string;
};

@Injectable({
  providedIn: 'root'
})
export class SessionHandlingService {

  // Initialize and declare variables.
  isLoggedIn: Boolean = false;
  #BASE_URL: string = 'http://localhost:3000';
  validationError!: string | null;
  userData: DataForCookie = {role: '', username: '', first_name: '', last_name: '', token: ''};

  constructor(
    private route: Router,
    private cookieService: CookieService,
    private credenService: CredentialValidationService,
    private http: HttpClient

  ) { }

  /* Prepares a random token for the login session.
   * @return string
   * */
  private createToken(): string {
    const rand = function() {
        return Math.random().toString(36).substr(2); // remove `0.`
    };
    return rand() + rand(); 
  }

  /* Validates username and password against the "database"
   * and registers the session token if all good.
   * @param username string
   * @param password string
   * @return  Observable<DataForCookie>
   * */
  private validateLoginCredens(usernameParam: string, passwordParam: string, token: string): Observable<DataForCookie> {
    return this.http.post<DataForCookie>(this.#BASE_URL + '/login', {username: usernameParam, password: passwordParam, token: token})
  }

  /* Validates session token against the "database"
   * and registers the session token if all good.
   * @param username string
   * @param password string
   * @return Observable<DataForCookie>
   * */
  private validateSessionToken(token: string): Observable<DataForCookie> {
    return this.http.post<DataForCookie>(this.#BASE_URL + '/sessionValidation', {token: token})
  }

  /* Send a request to destroy the session register corresponding to the argument token value.
   * @param username string
   * @param password string
   * @return Observable<DataForCookie>
   * */
  private destroySessionToken(token: string): Observable<DataForCookie> {
    return this.http.post<DataForCookie>(this.#BASE_URL + '/logout', {token: token})
  }

  /* Try to validate credens and login the user.
   * After successful login create cookie.
   * @param inputUsername string
   * @param inputPassword string
   * @return void
   **/
  login(inputUsername: string, inputPassword: string): void {
    const validationResult: Observable<DataForCookie> = this.validateLoginCredens(
      inputUsername,
      inputPassword,
      this.createToken()
    );

    validationResult.subscribe((res) => {
        if (Object.keys(res).length > 0) {
          this.cookieService.set(
            'SeqMineSession',
            res.token,
            { expires: 3 }
          );
          this.userData = res;
          this.isLoggedIn = true;
          this.route.navigate(['/home']);
        } else {
          this.validationError = 'Invalid username or password.';
        }
    });
  }


  /* Try to validate the session cookie of the user.
   * If the token is valid and still alive, then continue with the session.
   * @param inputUsername string
   * @param inputPassword string
   * @return void
   **/
  validateSessionCookie(){
      if (this.cookieService.getAll()['SeqMineSession'] !== undefined) {
        const token: string = this.cookieService.getAll()['SeqMineSession'];
        const validationResult: Observable<DataForCookie> = this.validateSessionToken(token);

        validationResult.subscribe((res) => {
            if (Object.keys(res).length > 0) {
              this.isLoggedIn = true;
              this.userData = res;
              this.route.navigate(['/home']);
            }
        });
      }
  }


  // Delete cookie and logout.
  public doLogOut() {
    const token: string = this.cookieService.getAll()['SeqMineSession'];
    this.destroySessionToken(token).subscribe({
        next: result => {
        },
        error: error => {
        }
    });
    this.cookieService.deleteAll();
    this.isLoggedIn = false;
  }

}
