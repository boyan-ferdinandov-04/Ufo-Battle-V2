import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class ScoresService {
  recordsUrl: string = `${"http://wd.etsisi.upm.es:10000"}/records`;

  constructor(
    private http: HttpClient,
    private token: TokenService,
    private userService: UserService
  ) {}

  getScores(): Observable<any> {
    return this.http.get(this.recordsUrl);
  }

  getScoresByUser(user: string): Observable<any> {
    //if (this.token.validToken()) this.userService.refreshLogin();
    const token = this.token.getToken();
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.get(`${this.recordsUrl}/${user}`, { headers });
  }

  postRecord(newRecord: any): Observable<any> {
    //if (this.token.validToken()) this.userService.refreshLogin();
    const token = this.token.getToken();
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.post(this.recordsUrl, newRecord, { headers });
  }
}
