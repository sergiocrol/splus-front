import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Community } from './community.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CommunityService {
  private urlCommunity = `${environment.apiUrl}communities`;
  private urlDiscussions = `${environment.apiUrl}discussions`;
  private urlBlog = `${environment.apiUrl}blog`;
  private urlActivity = `${environment.apiUrl}activity`;
  private urlMedia = `${environment.apiUrl}activity/files`;
  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private store: Store<fromRoot.State>, private http: HttpClient, private cookies: CookieService) {}

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

  fetchActivity({
    communityId
  }: {
    communityId: string;
  }): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlActivity}?communityId=${communityId}`,
        this.httpOptions
      )
      .pipe(
        map((data: any) =>
          data.body.data.files.map((file: any) => {
            return {
              id: file.id,
              title: file.title,
              description: this.parseElement(file.description),
              author: {
                id: file.author.id,
                fullName: file.author.fullName,
              },
              fileIdentifier: file.fileIdentifier,
              createdDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(file.createdDate))
              ),
              displayDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(file.displayDate))
              ),
            };
          })
        )
      );
  }

  fetchMedia(fileId: string | undefined, userId: number): Observable<any> {
    return this.http.get<any>(`${this.urlMedia}?fileId=${fileId}&userId=${userId}`, this.httpOptions);
  }
}
