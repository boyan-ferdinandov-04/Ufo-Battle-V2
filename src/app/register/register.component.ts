import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../user.service";
import { User } from "../models/user";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  user: User = new User();
  repeatPassword: string = "";
  isLoggedIn: boolean = false;
  usernameExists: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  checkUsername() {
    if (this.user.username) {
      this.userService.checkUsernameExists(this.user.username).subscribe({
        next: (exists: boolean) => {
          alert("User is already registered.");
          this.usernameExists = exists;
        },
      });
    }
  }

  onSubmit() {
    this.userService.registerUser(this.user).subscribe({
      next: () => {
        alert("User registered successfully.");
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        if (error.status === 409) alert("User is already registered.");
        else alert("There was an error registering the user.");
      },
    });
  }
}
