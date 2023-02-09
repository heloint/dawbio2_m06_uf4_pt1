import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export type DBUserArr = {
    result: Array<DBUser>
}

export type DBUser = {
    user_id: number,
    username: string,
    role: string,
    password: string,
    email: string,
    first_name: string,
    last_name: string,
    registration_date: Date,
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
    let res = this.http.get<DBUserArr>(this.#BASE_URL + '/users');
    return res;
  }

  // Requests to find a user by it's ID.
  public getUserByID(inputID: number) {
    return this.http.post<DBUserArr>(this.#BASE_URL + '/userByID', {userID: inputID})
  }
}
