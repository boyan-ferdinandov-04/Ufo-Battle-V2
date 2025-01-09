import { Component } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  user: User = new User();
  repeatPassword: string = "";
  usernameExists: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  checkUsername(): void {
    if (!this.user.username) return;

    this.userService.checkUsernameExists(this.user.username).subscribe({
      next: (exists: boolean) => {
        this.usernameExists = exists;
        if (exists) alert("User is already registered.");
      },
      error: () => alert("Error checking username availability."),
    });
  }

  onSubmit(): void {
    if (this.user.password !== this.repeatPassword) {
      alert("Passwords do not match.");
      return;
    }

    this.userService.registerUser(this.user).subscribe({
      next: () => {
        alert("User registered successfully.");
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        if (error.status === 409) {
          alert("User is already registered.");
        } else {
          alert("There was an error registering the user.");
        }
      },
    });
  }
}
