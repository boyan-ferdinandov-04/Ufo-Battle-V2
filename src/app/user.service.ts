import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private usersUrl = `${"http://wd.etsisi.upm.es:10000"}/users`;
  constructor(private http: HttpClient, private tokenMng: TokenService) {}

  login(user: string, pass: string): Observable<any> {
    return this.http.get(
      `${this.usersUrl}/login?username=${user}&password=${pass}`,
      { observe: "response" }
    );
  }


  isUserLoggedIn() {
    const token = this.tokenMng.getToken();
    return token !== null;
  }

  logOut() {
    this.tokenMng.removeToken();

  }

  checkUsernameExists(username: string) {
    return this.http.get<boolean>(`${this.usersUrl}/${username}`);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(this.usersUrl, user);
  }
}
