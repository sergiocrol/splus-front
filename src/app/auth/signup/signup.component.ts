import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';

export enum Status {
  new = 'new',
  waiting = 'waiting',
  blocked = 'blocked',
}

export interface DialogData {
  status: Status;
  username: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  title: string = '';
  subtitle: string = '';
  buttonText: string = '';
  isLoading$: Observable<boolean> | undefined;
  sub: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<AuthService>,
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClick(): void {
    if (this.data.status === Status.new) {
      this.store.dispatch(new UI.StartLoading());
      this.sub = this.authService.signup(this.data.username).subscribe(
        (res) => {
          console.log(res);
          this.uiService.showSnackbar(
            '¡Solicitud enviada correctamente!',
            'cerrar',
            5000,
            'success'
          );
          this.store.dispatch(new UI.StopLoading());
        },
        (error) => {
          this.uiService.showSnackbar(
            'Parece que ha habido un problema se servidor. Vuelve a intentarlo más tarde.',
            'cerrar',
            5000,
            'error'
          );
          this.store.dispatch(new UI.StopLoading());
        }
      );
    }
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    if (this.data.status === Status.new) {
      this.title = 'Solicitar permiso';
      this.subtitle =
        'Debes solicitar permiso a el/la administrador/a para acceder a la aplicación. ¿Desea solicitarlo?';
      this.buttonText = 'Solicitar';
    } else if (this.data.status === Status.waiting) {
      this.title = 'Esperando confirmación';
      this.subtitle =
        'El/la administrador/a aún no ha validado tu solicitud. Ponte en contacto para más información.';
      this.buttonText = 'Aceptar';
    } else {
      this.title = 'Usuario sin acceso';
      this.subtitle =
        'Parece que actualmente no tienes acceso a la plataforma. Contacta con el/la administrador/a para más información.';
      this.buttonText = 'Aceptar';
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
