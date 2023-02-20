import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap, filter, take } from 'rxjs/operators';
import { SessionHandlingService } from '../services/session-handling.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private sessionHandler: SessionHandlingService,
    private route: Router,
  ) {}

  private isRefreshing$ = new BehaviorSubject<boolean>(false);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage['token'];
    const refreshToken = localStorage['refreshToken'];

    if (!token) {
      return next.handle(request);
    }

    const extendedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(extendedRequest);
  }
}
