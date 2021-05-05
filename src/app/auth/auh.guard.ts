import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from './auth.service';
import * as Auth from '../auth/auth.actions';
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad, OnDestroy {
  helper = new JwtHelperService();
  localToken: string | null = null;
  decodedToken = null;
  fbSubs: Subscription[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  validate() {
    this.localToken = this.cookieService.get('esbApitoken');
    this.decodedToken = this.localToken
      ? this.helper.decodeToken(this.localToken)
      : null;
    return this.decodedToken;
  }

  isAdmin() {
    this.authService.isAdmin().subscribe(
      (res) => {
        return;
      },
      (err) => {
        this.router.navigate(['/community']);
      }
    );
  }

  canLoad(route: Route) {
    const isValid: any = this.validate();
    if (!isValid) {
      this.store.dispatch(new Auth.SetUnauthenticated());
      this.router.navigate(['/login']);
      return false;
    } else {
      if (route.path === 'dashboard') this.isAdmin();
      this.store.dispatch(new Auth.SetAuthenticated());
      return true;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isValid: any = this.validate();
    if (isValid) {
      this.store.dispatch(new Auth.SetAuthenticated());
      this.router.navigate(['/community']);
      return false;
    } else {
      this.store.dispatch(new Auth.SetUnauthenticated());
      return true;
    }
  }

  ngOnDestroy(): void {
    this.fbSubs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
