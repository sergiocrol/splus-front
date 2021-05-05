import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { SignupComponent } from './signup/signup.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
  private urlLogin = `${environment.apiUrl}login`;
  private urlSignup = `${environment.apiUrl}signup`;
  private urlAdmin = `${environment.apiUrl}admin`;
  httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  handleAuthRequest(status: number, message: string, username: string) {
    let statusType = '';
    if (status === 404) {
      statusType = 'new';
    } else {
      if (message === 'waiting') {
        statusType = 'waiting';
      } else {
        statusType = 'blocked';
      }
    }
    this.dialog.open(SignupComponent, {
      width: '320px',
      height: '370px',
      data: { status: statusType, username },
    });
  }

  login(authData: AuthData): Observable<any> {
    return this.http.post<any>(this.urlLogin, authData, this.httpOptions);
  }

  logout() {
    this.cookieService.delete('esbApitoken');
    this.router.navigate(['/login']);
  }

  signup(username: string): Observable<any> {
    return this.http.post<any>(this.urlSignup, { username }, this.httpOptions);
  }

  isAdmin() {
    return this.http.get(this.urlAdmin, this.httpOptions);
  }
}
