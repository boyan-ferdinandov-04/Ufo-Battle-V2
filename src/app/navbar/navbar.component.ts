import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.isLoggedIn = this.userService.isUserLoggedIn();
  }

  logout() {
    this.userService.logOut();
    this.isLoggedIn = false;
    window.location.reload();
  }
}
