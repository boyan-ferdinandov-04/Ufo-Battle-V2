import { Component } from "@angular/core";
import { UserService } from "../services/user.service";
import { TokenService } from "../services/token.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  user = { username: "", password: "" };

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  login(): void {
    const { username, password } = this.user;

    if (!username.trim() || !password.trim()) {
      alert("Username and password are required!");
      return;
    }

    this.userService.login(username, password).subscribe({
      next: (response: any) => {
        const token = response.headers.get("Authorization");
        if (token) {
          this.tokenService.saveToken(token);
          alert("Login successful.");
          window.location.reload();
        } else {
          alert("Authorization token not found.");
        }
      },
      error: (error) => {
        console.error("Login error:", error);
        if (error.status === 401) {
          alert("Invalid username or password.");
        } else {
          alert("Something went wrong. Please try again later.");
        }
      },
    });
  }
}
