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
  private urlActivity = `${environment.apiUrl}activity`;
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
              fileIdentifier: `https://samsung.sumtotal.host/Core/${file.fileIdentifier}.sumtfile?type=2`,
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

  fetchMedia({ url }: { url: string}): Observable<any> {
    const httpOptionsMedia = {
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response'
    };
    return this.http.get<any>(url, httpOptionsMedia);
  }
}


// fetch("https://samsung.sumtotal.host/Core/4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile?type=2", {
//   "headers": {
//     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
//     "sec-ch-ua-mobile": "?0",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrer": "https://samsung.sumtotal.host/core/socialCommunities/609c09aec25776264c107709",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "omit"
// });
