import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private serverUrl = 'http://localhost:3000'; // local server

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  fetchPreferences(username: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.serverUrl}/preferences/remote/${username}`, { headers });
  }

  savePreferences(username: string, prefs: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.serverUrl}/preferences/remote/${username}`, prefs, {
      headers,
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
