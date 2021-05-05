import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [DashboardComponent, ConfirmationModalComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
})
export class DashboardModule {}
