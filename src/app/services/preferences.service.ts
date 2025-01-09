import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private localServerUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getPreferences(username: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.localServerUrl}/preferences/remote/${username}`, { headers });
  }

  savePreferences(username: string, prefs: { ufos: number; time: number }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.localServerUrl}/preferences/remote/${username}`, prefs, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
