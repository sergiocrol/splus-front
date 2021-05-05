import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { AuthService } from '../auth/auth.service';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/animation/notification.json',
  };
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  avatar!: string;
  isAdmin: boolean = false;
  isNotification: boolean = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  getDimension() {
    return window.innerWidth > 520
      ? 'assets/svg/logo2.svg'
      : 'assets/svg/logo_small.svg';
  }

  getAvatar() {
    return `assets/avatar/avatar${Math.floor(Math.random() * 16) + 1}.png`;
  }

  logout() {
    this.authService.logout();
  }

  admin() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.authService.isAdmin().subscribe(
      (res) => (this.isAdmin = true),
      (err) => (this.isAdmin = false)
    );
    this.dashboardService.getAllUsers().subscribe(
      (res) =>
        (this.isNotification =
          res.body.data.filter((u: any) => u.status === 'waiting').length > 0),
      (err) => (this.isNotification = false)
    );
    this.avatar = this.getAvatar();
  }
}
