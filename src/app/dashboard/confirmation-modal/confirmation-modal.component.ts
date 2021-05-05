import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  username: string = '';
  title: string = '';
  subtitle: string = '';

  constructor(
    public dialogRef: MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClick() {}

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.username = this.data.username;
    this.title = this.data.text.title;
    this.subtitle = this.data.text.subtitle;
  }
}
