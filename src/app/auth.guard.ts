import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // 1) Check if the user is logged in
    if (!this.userService.isUserLoggedIn()) {
      // 2) If not, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    // 3) Otherwise, allow activation
    return true;
  }
}
