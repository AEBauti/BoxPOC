import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenResponse } from '../models/token';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private baseUrl = 'https://localhost:44316/api/';
  private userId: string;
  public constructor(private httpClient: HttpClient) {}

  public getUserToken(userId: string): Observable<TokenResponse> {
    return this.httpClient
      .get<TokenResponse>(this.baseUrl + `boxusers/${userId}/token`)
      .pipe(tap((token) => (this.userId = token.id)));
  }

  public getUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + 'boxusers');
  }

  public createCollab(body: any): Observable<any> {
    body.userId = this.userId;
    return this.httpClient.post<any>(this.baseUrl + 'boxcollaborations', body);
  }
}
