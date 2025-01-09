import { Component, OnInit } from "@angular/core";
import { ScoresService } from "../services/scores.service";
import { UserService } from "../services/user.service";
import { TokenService } from "../services/token.service";

@Component({
  selector: "app-records",
  templateUrl: "./records.component.html",
  styleUrls: ["./records.component.css"],
})
export class RecordsComponent implements OnInit {
  scoresList: any[] = [];
  userScoresList: any[] = [];
  isUserLoggedIn = false;

  constructor(
    private scoresService: ScoresService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.userService.isUserLoggedIn();
    this.loadScores();
  }

  private loadScores(): void {
    this.fetchScores();

    if (this.isUserLoggedIn) {
      this.fetchUserScores();
    }
  }

  private fetchScores(): void {
    this.scoresService.getScores().subscribe({
      next: (scores) => this.scoresList = this.sortByDate(scores),
      error: () => console.error("Error fetching scores."),
    });
  }

  private fetchUserScores(): void {
    const user = this.tokenService.getLoggedInUser();
    if (!user)
      return console.warn("No logged-in user found.");

    this.scoresService.getScoresByUser(user).subscribe({
      next: (userScores) => this.userScoresList = this.sortByDate(userScores),
      error: () => console.error("Error fetching user scores."),
    });
  }

  private sortByDate(scores: any[]): any[] {
    return scores.sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  }
}
