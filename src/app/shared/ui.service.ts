import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type SnackbarType = 'success' | 'error';

@Injectable()
export class UIService {
  snackbarType = { success: 'snackbar-success', error: 'snackbar-error' };

  constructor(private snacknar: MatSnackBar) {}

  showSnackbar(
    message: string,
    action: string | undefined,
    duration: number,
    type: SnackbarType
  ) {
    this.snacknar.open(message, action, {
      duration,
      panelClass: this.snackbarType[type] || 'snackbar-error',
    });
  }
}
