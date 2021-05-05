import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRoot from '../app.reducer';
import { AuthService } from '../auth/auth.service';
import * as UI from '../shared/ui.actions';
import { UIService } from '../shared/ui.service';
import { DashboardService } from './dashboard.service';
import { User } from './user.model';

import { usersMock } from '../mock/users';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  options: AnimationOptions = {
    path: '/assets/animation/notification.json',
  };
  myGroup!: FormGroup;
  users: User[] = [];
  waitingUsers: User[] = [];
  isLoading$!: Observable<boolean>;
  fbSubs: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private store: Store<fromRoot.State>,
    private uiService: UIService,
    private authService: AuthService,
    private router: Router
  ) {}

  addUser() {
    const username = this.myGroup.get('username')?.value.trim();
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.dashboardService.addUser(username).subscribe(
        (res) => {
          this.uiService.showSnackbar(
            `${username} añadido correctamente`,
            'cerrar',
            5000,
            'success'
          );
          this.store.dispatch(new UI.StopLoading());
          this.getUsers();
        },
        (err) => {
          this.uiService.showSnackbar(
            `Error al crear el usuario. Inténtalo de nuevo.`,
            'cerrar',
            5000,
            'error'
          );
          this.store.dispatch(new UI.StopLoading());
        }
      )
    );
  }

  updateStatus(event: {
    checked: boolean;
    source: { name: string | null; message?: string };
  }) {
    const status = event.checked ? 'active' : 'blocked';
    const username = event.source.name;
    // this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.dashboardService.updateUser(username, status).subscribe(
        (res) => {
          this.uiService.showSnackbar(
            `${username} ${
              event.checked ? 'activado/a' : 'desactivado/a'
            } correctamente`,
            'cerrar',
            5000,
            'success'
          );
          if (event.source.message) {
            window.location.reload();
          }
          // this.store.dispatch(new UI.StopLoading());
        },
        (err) => {
          this.uiService.showSnackbar(
            `Error al actualizar el usuario. Inténtalo de nuevo.`,
            'cerrar',
            5000,
            'error'
          );
          // this.store.dispatch(new UI.StopLoading());
        }
      )
    );
  }

  deleteUser(username: any, message?: string) {
    const title = message ? 'Rechazar solicitud' : 'Eliminar usuario';
    const subtitle = message
      ? `¿Quieres rechazar la solicitud de ${username}?`
      : `¿Quieres eliminar a ${username}?`;
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '300px',
      height: '220px',
      data: {
        username,
        text: {
          title,
          subtitle,
        },
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // eliminamos
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(
          this.dashboardService.deleteUser(username).subscribe(
            (res) => {
              this.uiService.showSnackbar(
                message ? message : `${username} eliminado/a correctamente`,
                'cerrar',
                5000,
                'success'
              );
              this.store.dispatch(new UI.StopLoading());
              message ? window.location.reload() : this.getUsers();
            },
            (err) => {
              this.uiService.showSnackbar(
                `Error al eliminar el usuario. Inténtalo de nuevo.`,
                'cerrar',
                5000,
                'error'
              );
              this.store.dispatch(new UI.StopLoading());
            }
          )
        );
      }
    });
  }

  getUsers() {
    this.store.dispatch(new UI.StartLoading());
    // this.users = usersMock.body.data;
    this.fbSubs.push(
      this.dashboardService.getAllUsers().subscribe(
        (res) => {
          this.store.dispatch(new UI.StopLoading());
          this.users = res.body.data.filter(
            (user: User) => user.status !== 'waiting'
          );
          this.waitingUsers = res.body.data.filter(
            (user: User) => user.status === 'waiting'
          );
        },
        (err) => {
          this.store.dispatch(new UI.StopLoading());
          // this.authService.logout();
        }
      )
    );
  }

  acceptRequest(username: string) {
    this.updateStatus({
      checked: true,
      source: {
        name: username,
        message: `La solicitud de ${username} ha sido aceptada.`,
      },
    });
  }

  rejectRequest(username: string) {
    const message = `Se ha rechazado la solicitud de ${username}`;
    this.deleteUser(username, message);
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.myGroup = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
    });
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.fbSubs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
