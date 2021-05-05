import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { CommunityComponent } from './community.component';
import { SharedModule } from '../shared/shared.module';
import { CommunityRoutingModule } from './community-routing.module';
import { communityReducer } from './community.reducer';
import { CommunityCardComponent } from './community-card/community-card.component';
import { DiscussionsComponent } from './discussions/discussions.component';

@NgModule({
  declarations: [
    CommunityComponent,
    CommunityCardComponent,
    DiscussionsComponent,
  ],
  imports: [
    SharedModule,
    CommunityRoutingModule,
    StoreModule.forFeature('community', communityReducer),
  ],
})
export class CommunityModule {}
