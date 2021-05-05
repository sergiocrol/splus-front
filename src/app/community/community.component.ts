import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, pipe } from 'rxjs';
import { take } from 'rxjs/operators';

import { Community } from './community.model';
import { UIService } from '../shared/ui.service';
import { CommunityService } from './community.service';
import * as fromCommunity from './community.reducer';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Com from '../community/community.actions';

import { communitiesMock } from '../mock/communities';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit, OnDestroy {
  communities!: Community[];
  private fbSubs: Subscription[] = [];
  isLoading$!: Observable<boolean>;
  isLoading = true;

  constructor(
    private communityService: CommunityService,
    private store: Store<fromCommunity.State>,
    private uiService: UIService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.communities = communitiesMock.body.data.communities.map(
    //   (c: Community) => {
    //     return {
    //       id: c.id,
    //       name: c.name,
    //       description: c.description,
    //       logoIdentifier: c.logoIdentifier,
    //       avgRating: c.avgRating,
    //       totalMemberCount: c.totalMemberCount,
    //       discussionCount: c.discussionCount,
    //       blogCount: c.blogCount,
    //     };
    //   }
    // );
    // this.store.dispatch(new Com.SetCommunities({ ...this.communities }));
    // this.store
    //   .pipe(select(fromCommunity.getCommunities), take(1))
    //   .subscribe((res) => {
    //     console.log(Object.keys(res).length === 0);
    //     Object.keys(res).length !== 0 ? console.log('Sí') : console.log('No');
    //   });
    // console.log(this.communities);

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.fbSubs.push(
      this.store
        .pipe(select(fromCommunity.getCommunities), take(1))
        .subscribe((result) => {
          if (Object.keys(result).length !== 0) {
            this.communities = [...result];
          } else {
            this.fbSubs.push(
              this.communityService.fetchCommunities().subscribe(
                (res) => {
                  this.store.dispatch(new UI.StopLoading());
                  this.communities = res.body.data.communities.map(
                    (c: Community) => {
                      return {
                        id: c.id,
                        name: c.name,
                        description: c.description,
                        logoIdentifier: c.logoIdentifier,
                        avgRating: c.avgRating,
                        totalMemberCount: c.totalMemberCount,
                        discussionCount: c.discussionCount,
                        blogCount: c.blogCount,
                      };
                    }
                  );
                  this.store.dispatch(
                    new Com.SetCommunities([...this.communities])
                  );
                },
                (error) => {
                  console.log(error);
                  this.store.dispatch(new UI.StopLoading());
                  this.uiService.showSnackbar(
                    'La sesión ha caducado.',
                    'cerrar',
                    5000,
                    'error'
                  );
                  this.authService.logout();
                }
              )
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.fbSubs.forEach((sub: Subscription) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
