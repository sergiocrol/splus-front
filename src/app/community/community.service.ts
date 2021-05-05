import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Community } from './community.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class CommunityService {
  private urlCommunity = `${environment.apiUrl}communities`;
  private urlDiscussions = `${environment.apiUrl}discussions`;
  private urlBlog = `${environment.apiUrl}blog`;
  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private store: Store<fromRoot.State>, private http: HttpClient) {}

  parseElement(element: string) {
    const html = element;
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text;
  }

  fetchCommunities(): Observable<any> {
    this.store.dispatch(new UI.StartLoading());
    return this.http.get<any>(this.urlCommunity, this.httpOptions);
  }

  fetchDiscussions({
    communityId,
    discussionsCount,
  }: {
    communityId: string;
    discussionsCount: string;
  }): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlDiscussions}?communityId=${communityId}&discussionsCount=${discussionsCount}`,
        this.httpOptions
      )
      .pipe(
        map((data: any) =>
          data.body.data.discussions.map((dis: any) => {
            return {
              id: dis.id,
              title: dis.title,
              description: this.parseElement(dis.description),
              author: {
                id: dis.author.id,
                fullName: dis.author.fullName,
              },
              createdDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(dis.createdDate))
              ),
              displayDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(dis.displayDate))
              ),
            };
          })
        )
      );
  }

  fetchBlog({
    communityId,
    blogCount,
  }: {
    communityId: string;
    blogCount: string;
  }): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlBlog}?communityId=${communityId}&blogCount=${blogCount}`,
        this.httpOptions
      )
      .pipe(
        map((data: any) =>
          data.body.data.blogs.map((blg: any) => {
            return {
              id: blg.id,
              title: blg.title,
              description: this.parseElement(blg.description),
              author: {
                id: blg.author.id,
                fullName: blg.author.fullName,
              },
              createdDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(blg.createdDate))
              ),
              displayDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(blg.displayDate))
              ),
            };
          })
        )
      );
  }
}
