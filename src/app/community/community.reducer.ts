import { Community } from './community.model';

import { ComminityActions, SET_COMMUNITIES } from './community.actions';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface CommunityState {
  communities: Community[];
}

export interface State extends fromRoot.State {
  community: CommunityState;
}

const initialState: CommunityState = {
  communities: [],
};

export function communityReducer(
  state = initialState,
  action: ComminityActions
) {
  switch (action.type) {
    case SET_COMMUNITIES:
      return {
        ...state,
        communities: action.payload,
      };
    default:
      return state;
  }
}

export const getCommunityState = createFeatureSelector<CommunityState>(
  'community'
);

export const getCommunities = createSelector(
  getCommunityState,
  (state: CommunityState) => state.communities
);
