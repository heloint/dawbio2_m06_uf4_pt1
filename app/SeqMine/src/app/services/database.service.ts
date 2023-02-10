import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Represents a response with user related queries.
export type DBUserArr = {
    result: Array<DBUser>
}

// Represents an item in a response with user related queries.
export type DBUser = {
    user_id: number,
    username: string,
    role_name: string,
    password: string,
    email: string,
    first_name: string,
    last_name: string,
    registration_date: Date,
}

// Represents a response with role related queries.
export type DBRoleArr = {
    result: Array<DBRole>
}

// Represents an item in a response with role related queries.
export type DBRole = {
  role_id: number,
  role_name: string
}

export type DBLastUserID = {
  result: number;
}

export type QueryConfirmation = {
    result: Boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // Base URL to the REST API server.
  #BASE_URL: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
  ) { }

  // Requests all the users can be found in the database.
  public getAllUsers() {
    return this.http.get<DBUserArr>(this.#BASE_URL + '/users');
  }

  // Requests all the roles can be found in the database.
  public getAllRoles() {
    return this.http.get<DBRoleArr>(this.#BASE_URL + '/roles');
  }

  /* Requests to find a user by it's ID.
   * @param inputID number
   * */
  public getUserByID(inputID: number) {
    return this.http.post<DBUserArr>(this.#BASE_URL + '/userByID', {userID: inputID});
  }

  // Requests the last user id from the database.
  public getLastUserID() {
    return this.http.get<DBLastUserID>(this.#BASE_URL + '/lastUserID');
  }

  /* Send a request to the server to delete a user by the argument ID.
   * @param inputID number
   * */
   public deleteUserByID(inputID: number) {
     return this.http.post<QueryConfirmation>(this.#BASE_URL + '/deleteUserByID', {userID: inputID});
   }

   /* Send a request to the server with a User object to update it's register with the new data.
    * @param user DBUser
    * */
    public updateUser(user: DBUser) {
        return this.http.post<QueryConfirmation>(this.#BASE_URL + '/updateUser', user);
    }

   /* Send a request to the server with a User object to create a new resgister.
    * @param user DBUser
    * */
    public addUser(user: DBUser) {
        return this.http.post<QueryConfirmation>(this.#BASE_URL + '/addUser', user);
    }
}
