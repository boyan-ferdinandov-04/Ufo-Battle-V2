import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service'; // Import TokenService

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  username: string | null = null; // Add a username property

  constructor(private userService: UserService, private tokenService: TokenService) {}

  ngOnInit() {
    this.isLoggedIn = this.userService.isUserLoggedIn();
    if (this.isLoggedIn) {
      this.username = this.tokenService.getLoggedInUser(); // Fetch the username
    }
  }

  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
    this.username = null; // Clear the username on logout
    window.location.reload();
  }
}
