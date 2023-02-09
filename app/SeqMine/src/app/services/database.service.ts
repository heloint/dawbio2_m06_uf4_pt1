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
  constructor(
    private http: HttpClient,
  ) { }

  public getAllUsers() {
    // TODO
    let res = this.http.get<DBUserArr>('http://localhost:3000/users');
    return res;
  }
}
