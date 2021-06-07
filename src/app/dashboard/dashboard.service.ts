import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable()
export class DashboardService {
  private user = `${environment.apiUrl}user`;
  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.user, this.httpOptions);
  }

  addUser(username: string): Observable<any> {
    return this.http.post<any>(this.user, { username }, this.httpOptions);
  }

  deleteUser(username: string): Observable<any> {
    const deleteHttpOptions = {
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
      body: { username },
    };
    
    return this.http.request<any>('delete', this.user, deleteHttpOptions);
  }

  updateUser(username: string | null, status: string): Observable<any> {
    return this.http.put<any>(
      this.user,
      { username, status },
      this.httpOptions
    );
  }
}
