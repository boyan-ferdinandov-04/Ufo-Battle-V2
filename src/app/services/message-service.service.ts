import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl = 'http://wd.etsisi.upm.es:10000/messages';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}
  private getAuthHeaders(): HttpHeaders{
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `${token}`
    })
  }

  getMessages(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  deleteMessages(username:string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/${username}`;
    return this.http.delete(url, { headers });
  }

}
