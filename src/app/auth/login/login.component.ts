import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { CookieService } from 'ngx-cookie-service';
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';
import * as Auth from '../../auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading$!: Observable<boolean>;
  private authSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private uiService: UIService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  async ngOnInit(): Promise<void> {
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
    this.store.dispatch(new UI.StartLoading());
    this.authSub = this.authService
      .login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      })
      .subscribe(
        (res) => {
          this.cookieService.set('esbApitoken', res.body.data.token);
          this.store.dispatch(new Auth.SetAuthenticated());
          this.store.dispatch(new UI.StopLoading());
          this.router.navigate(['/community']);
        },
        (error) => {
          this.store.dispatch(new UI.StopLoading());
          if (error.status === 0) {
            this.uiService.showSnackbar(
              'Parece que hay un fallo de servidor :(',
              'cerrar',
              5000,
              'error'
            );
          } else {
            if (error.status === 401 && error.error.message === 'Invalid') {
              this.loginForm.get('password')?.setErrors({ incorrect: true });
              this.store.dispatch(new Auth.SetUnauthenticated());
              this.uiService.showSnackbar(
                'Usuario y/o contraseña incorrectos',
                'cerrar',
                5000,
                'error'
              );
            } else {
              const status = error.status;
              const message = error.error.message;
              this.authService.handleAuthRequest(
                status,
                message,
                this.loginForm.value.username
              );
            }
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
