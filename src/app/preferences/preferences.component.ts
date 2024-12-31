import { Component, OnInit } from '@angular/core';

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

  ngOnInit() {
    // Load saved preferences from session storage if available
    const savedUfoCount = localStorage.getItem('ufoCount');
    const savedGameTime = localStorage.getItem('gameTime');
    if (savedUfoCount && savedGameTime) {
      this.preferences.ufoCount = parseInt(savedUfoCount, 10);
      this.preferences.gameTime = parseInt(savedGameTime, 10);
    }
  }

  savePreferences() {
    localStorage.setItem('ufoCount', this.preferences.ufoCount.toString());
    localStorage.setItem('gameTime', this.preferences.gameTime.toString());
    alert('Preferences saved successfully!');
  }
}
