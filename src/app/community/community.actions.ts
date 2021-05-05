import { Action } from '@ngrx/store';

import { Community } from './community.model';

export const SET_COMMUNITIES = '[Community] Set Communities';

export class SetCommunities implements Action {
  readonly type = SET_COMMUNITIES;

  constructor(public payload: Community[]) {}
}

export type ComminityActions = SetCommunities;
