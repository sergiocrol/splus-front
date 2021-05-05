import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommunityComponent } from './community.component';
import { DiscussionsComponent } from './discussions/discussions.component';

const routes: Routes = [
  { path: '', component: CommunityComponent },
  { path: ':id', component: DiscussionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
