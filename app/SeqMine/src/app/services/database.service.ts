import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export type DBUserArr = {
    result: Array<DBUser>
}

export type DBRoleArr = {
    result: Array<DBRole>
}

export type DBRole = {
  role_id: number,
  role: string
}

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

export type DBLastUserID = {
  result: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

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

  // Requests to find a user by it's ID.
  public getUserByID(inputID: number) {
    return this.http.post<DBUserArr>(this.#BASE_URL + '/userByID', {userID: inputID})
  }

  // Requests the last user id from the database.
  public getLastUserID() {
    return this.http.get<DBLastUserID>(this.#BASE_URL + '/lastUserID');
  }
}
