import { TokenService } from "../token.service";
import { UserService } from "../user.service";
import { ScoresService } from "../scores.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-records",
  templateUrl: "./records.component.html",
  styleUrl: "./records.component.css",
})
export class RecordsComponent implements OnInit {
  scoresList: Array<any> = [];
  userScoresList: Array<any> = [];
  isUserLoggedIn = false;
  constructor(
    private scores: ScoresService,
    private userService: UserService,
    private tokenMng: TokenService
  ) {}
  listScores() {
    this.scores.getScores().subscribe({
      next: (values) => {
        // Sort scoresList by recordDate in descending order
        this.scoresList = values.sort(
          (a: any, b: any) =>
            new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
        );
      },
      error: (err) => {
        console.log("There was an error");
      },
    });
    if (this.isUserLoggedIn) {
      const user = this.tokenMng.getLoggedInUser();
      if (!user) {
        return;
      }
      this.scores.getScoresByUser(user).subscribe({
        next: (values) => {
          this.userScoresList = values.sort((a: any, b: any) =>
          new Date(b.recordDate).getTime() -
            new Date(a.recordDate).getTime());
        },
        error: (err) => {
          console.log("There was an error");
        },
      });
    }
  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.userService.isUserLoggedIn();
    this.listScores();
  }
}
