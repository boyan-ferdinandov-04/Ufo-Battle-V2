import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly usersUrl = 'http://wd.etsisi.upm.es:10000/users';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.get(`${this.usersUrl}/login`, {
      params: { username, password },
      observe: 'response',
    });
  }

  isUserLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  logout(): void {
    this.tokenService.removeToken();
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.usersUrl}/${username}`);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.usersUrl}`, user);
  }
}
