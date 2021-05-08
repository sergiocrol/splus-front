import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UIService } from 'src/app/shared/ui.service';
import { FinderService } from '../finder.service';
import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';

@Component({
  selector: 'app-user-finder',
  templateUrl: './user-finder.component.html',
  styleUrls: ['./user-finder.component.scss'],
})
export class UserFinderComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  orgData = [];
  private finderSub!: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
    private finderService: FinderService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.userForm = new FormGroup({
      userId: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
    });
  }

  getErrorMessage() {
    return this.userForm.controls['userId'].hasError('required')
      ? 'Campo obligatorio'
      : 'No es un id de comercial válido';
  }

  onSubmit() {
    this.store.dispatch(new UI.StartLoading());
    this.finderSub = this.finderService
      .findUser(this.userForm.value.userId)
      .subscribe(
        (res) => {
          this.store.dispatch(new UI.StopLoading());
          console.log(res);
          this.orgData = res.body.data;
        },
        (err) => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar(
            'No se ha encontrado ese id de comercial',
            'cerrar',
            5000,
            'error'
          );
          console.log(err);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.finderSub) {
      this.finderSub.unsubscribe();
    }
  }
}
