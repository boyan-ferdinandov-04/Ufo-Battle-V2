import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class ScoresService {
  private readonly baseUrl: string = "http://wd.etsisi.upm.es:10000/records";

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `${token}`,
    });
  }

  getScores(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getScoresByUser(user: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/${user}`,
      { headers });
  }

  postRecord(newRecord: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.baseUrl, newRecord,
      { headers });
  }
}
