import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {jwtDecode} from  'jwt-decode';
import { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly localStorage: Storage | null;

  constructor(@Inject(DOCUMENT) private doc: Document) {
    this.localStorage = doc.defaultView?.localStorage || null;
  }

  saveToken(token: string): void {
    if (this.localStorage) {
      this.localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    const token = this.localStorage?.getItem('token');
    return token && this.isValidToken(token) ? token : null;
  }

  removeToken(): void {
    this.localStorage?.removeItem('token');
  }

  getLoggedInUser(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.username || null;
  }

  private isValidToken(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded?.exp ? currentTime < decoded.exp : false;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): JwtPayload & { username?: string } {
    try {
      return jwtDecode<JwtPayload & { username?: string }>(token);
    } catch {
      throw new Error('Invalid token');
    }
  }
}
