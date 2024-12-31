import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../user.service";
import { User } from "../models/user";
import { TokenService } from "../token.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  user: User = new User();
  mytoken: string = "";

  constructor(
    private userService: UserService,
    private tokenMng: TokenService
  ) {}

  dologin() {
    if (!this.user.username.trim() || !this.user.password.trim()) {
      alert("Please fill in both username and password.");
      return;
    }

    this.userService.login(this.user.username, this.user.password).subscribe({
      next: (response: any) => {
        const token = response.headers.get("Authorization");
        if (token) this.tokenMng.saveToken(token);
        window.location.reload();
      },
      error: (err: any) => {
        console.error(err);
        if (err.status === 401) {
          alert("Invalid username or password.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      },
    });
  }
}
