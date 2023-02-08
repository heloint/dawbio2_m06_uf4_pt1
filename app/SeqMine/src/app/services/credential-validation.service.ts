/*
 * Service in charge of serving and validating user credentials related data.
 * @Author Dániel Májer
 * */

import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export type RegistrationResult = {
  isSuccess: Boolean;
  errorMessage: string;
};

export type DataForCookie = {
  username: string;
  first_name: string;
  last_name: string;
  role: string;
};

export interface InfoTypes {
  [infoType: string]: Boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CredentialValidationService {

  #BASE_URL: string = 'http://localhost:3000/login';

  constructor(
    private http: HttpClient
  ) {}


  /* Validates username and password against the "database".
   * @param username string
   * @param password string
   * @return User | null
   * */
  public validateLoginCredens(usernameParam: string, passwordParam: string): Observable<DataForCookie> {
    return this.http.post<DataForCookie>(this.#BASE_URL, {username: usernameParam, password: passwordParam })
  }

  /* Validates user object against the "database".
   * @param user User
   * @return User | null
   * */
  private validateRegisterCredens(user: User): RegistrationResult {
    // TODO
    let result: RegistrationResult = {
      isSuccess: true,
      errorMessage: '',
    };

    /* const username: string = user.username;
    const email: string = user.email; */

    return result;
  }

  /* Validates user object against the "database" and update the array of User
   * objects by adding to it.
   * @param user User
   * @return RegistrationResult error messages + boolean
   * */
  public registerUser(user: User): RegistrationResult {
    // TODO
    let isValidRegistration: RegistrationResult =
      this.validateRegisterCredens(user);

    if (isValidRegistration.isSuccess) {
    }

    return isValidRegistration;
  }

  ngOnInit() {}
}
