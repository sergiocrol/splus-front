import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.scss'],
})
export class FinderComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading$!: Observable<boolean>;
  private authSub!: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.loginForm = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  getErrorMessage() {
    return this.loginForm.controls['password'].hasError('required')
      ? 'Campo obligatorio'
      : 'Usuario y/o contraseña incorrectos';
  }

  onSubmit() {
    const authData = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };
    this.store.dispatch(new UI.StartLoading());
    this.authSub = this.authService.login(authData).subscribe(
      (res) => {
        this.cookieService.set('esbApitoken', res.body.token);
        this.store.dispatch(new UI.StopLoading());
        this.router.navigate(['/user-finder']);
      },
      (err) => {
        this.store.dispatch(new UI.StopLoading());
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
