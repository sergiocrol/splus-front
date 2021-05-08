import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class FinderService {
  private url = `${environment.apiUrl}finder`;
  httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private http: HttpClient) {}

  findUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.url}?userId=${userId}`, this.httpOptions);
  }
}
