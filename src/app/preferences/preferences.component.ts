import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css'],
})
export class PreferencesComponent implements OnInit {
  preferences = {
    ufoCount: 1,
    gameTime: 60,
  };

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private prefsService: PreferencesService
  ) {}

  ngOnInit() {
    // Load from localStorage if it exists
    const savedUfoCount = localStorage.getItem('ufoCount');
    const savedGameTime = localStorage.getItem('gameTime');
    if (savedUfoCount && savedGameTime) {
      this.preferences.ufoCount = parseInt(savedUfoCount, 10);
      this.preferences.gameTime = parseInt(savedGameTime, 10);
    }
  }

  savePreferencesLocally() {
    localStorage.setItem('ufoCount', this.preferences.ufoCount.toString());
    localStorage.setItem('gameTime', this.preferences.gameTime.toString());
    alert('Preferences saved locally!');
  }

  savePreferencesOnServer() {
    // Make sure user is logged in
    if (!this.userService.isUserLoggedIn()) {
      alert('You must be logged in to save on the server.');
      return;
    }

    const username = this.tokenService.getLoggedInUser();
    if (!username) {
      alert('No username found in token.');
      return;
    }

    this.prefsService
      .savePreferences(username, {
        ufos: this.preferences.ufoCount,
        time: this.preferences.gameTime,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          alert('Preferences saved on server (MySQL) successfully!');
        },
        error: (err: any) => {
          console.error(err);
          alert('Error saving preferences on server.');
        },
      });
  }

  fetchPreferencesFromServer() {
    // Making sure user is logged in
    if (!this.userService.isUserLoggedIn()) {
      alert('You must be logged in to fetch preferences from the server.');
      return;
    }

    // Getting username from token
    const username = this.tokenService.getLoggedInUser();
    if (!username) {
      alert('No username found in token.');
      return;
    }

    this.prefsService.getPreferences(username).subscribe({
      next: (res: any) => {
        console.log('Fetched preferences from server:', res);
        this.preferences.ufoCount = res.ufos;
        this.preferences.gameTime = res.time;
        alert('Preferences fetched from server!');
      },
      error: (err: any) => {
        console.error(err);
        alert('Error fetching preferences from server.');
      },
    });
  }
}
