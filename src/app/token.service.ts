import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  localStorage;
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage;
  }

  saveToken(token: string) {
    if (this.localStorage)
      this.localStorage.setItem("token", token);
  }

  getToken() {
    if (!this.localStorage || !this.validToken()) return null;
    return this.localStorage.getItem("token");
  }

  getLoggedInUser() {
    if (!this.localStorage) return false;
    const tokenData = this.localStorage.getItem("token");
    if (!tokenData) {
      return false;
    }
    const token = this.decodeToken(tokenData);
    if (!token) {
      return false;
    }

    return token.username;
  }

  removeToken() {
    if (this.localStorage) this.localStorage.removeItem("token");
  }

  validToken() {
    if (!this.localStorage) return false;
    const tokenData = this.localStorage.getItem("token");
    if (!tokenData) {
      return false;
    }
    const token = this.decodeToken(tokenData);
    if (!token) {
      return false;
    }
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the current time is greater than the token's expiration time
    return currentTime < token.exp;
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
