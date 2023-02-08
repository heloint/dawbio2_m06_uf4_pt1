import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private http: HttpClient,
  ) { }

  public getAllUsers() {
    // TODO
    let res = this.http.get('http://localhost:3000/users');
    return res;
  }
}
