import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { GameService } from '../game.service';
import {ScoresService} from "../scores.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  points = 0;
  remainingTime = 60; // Default
  ufoCount = 1; // Default
  initialTime = 60; // Keep track of the starting time

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private keysPressed: { [key: string]: boolean } = {};

  constructor(private gameService: GameService,
              private scoresService: ScoresService,) {}

  ngOnInit(): void {
    const savedUfoCount = localStorage.getItem('ufoCount');
    const savedGameTime = localStorage.getItem('gameTime');
    if (savedUfoCount) this.ufoCount = parseInt(savedUfoCount, 10);
    if (savedGameTime) {
      this.remainingTime = parseInt(savedGameTime, 10);
      this.initialTime = this.remainingTime;
    }
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Initialize or reset the game state:
    // 1. Clear existing enemies before spawning new ones.
    this.gameService.enemies = [];

    // 2. Initialize player
    this.gameService.initializePlayer(this.canvas.width, this.canvas.height);

    // 3. Spawn EXACTLY the number of UFOs the user specified
    for (let i = 0; i < this.ufoCount; i++) {
      this.gameService.spawnEnemy(this.canvas.width, this.canvas.height);
    }

    // 4. Start the countdown timer and the game loop
    this.startTimer();
    this.startGameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.keysPressed[event.key] = true;

    // Shoot only if no projectile exists in the array
    if (event.key === 'ArrowUp') {
      if (this.gameService.projectiles.length === 0) {
        this.gameService.fireProjectile();
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keysPressed[event.key] = false;
  }

  startGameLoop() {
    const update = () => {
      // Clear the entire screen
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 1. Player movement
      this.handlePlayerMovement();
      // Draw player
      const player = this.gameService.player!;
      this.context.drawImage(
        player.image,
        player.position.x,
        player.position.y,
        player.width,
        player.height
      );

      // 2. Enemies: move + draw
      this.gameService.enemies.forEach((enemy) => {
        // Move enemy (basic back-and-forth)
        enemy.position.x += enemy.velocity.x;
        if (
          enemy.position.x < enemy.initialX - enemy.range ||
          enemy.position.x > enemy.initialX + enemy.range
        ) {
          enemy.velocity.x = -enemy.velocity.x;
        }
        // Draw
        this.context.drawImage(
          enemy.image,
          enemy.position.x,
          enemy.position.y,
          enemy.width,
          enemy.height
        );
      });

      // 3. Projectiles: move + draw
      this.gameService.projectiles.forEach((projectile, index) => {
        projectile.position.y += projectile.velocity.y;
        // Draw projectile
        this.context.drawImage(
          projectile.image,
          projectile.position.x,
          projectile.position.y,
          projectile.width,
          projectile.height
        );

        // If projectile is off-screen (top), remove it => missed shot
        if (projectile.position.y + projectile.height < 0) {
          this.gameService.projectiles.splice(index, 1);
          this.points -= 25; // Missed shot penalty
        }
      });

      // 4. Collision detection
      this.checkCollisions();

      // Keep looping if time hasn't run out
      if (this.remainingTime > 0) {
        requestAnimationFrame(update);
      }
    };

    update();
  }

  handlePlayerMovement() {
    const player = this.gameService.player!;
    if (this.keysPressed['ArrowRight']) {
      player.velocity.x = player.speed;
    } else if (this.keysPressed['ArrowLeft']) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;
    }

    // Update position
    player.position.x += player.velocity.x;

    // Clamp to canvas
    if (player.position.x < 0) {
      player.position.x = 0;
    }
    if (player.position.x + player.width > this.canvas.width) {
      player.position.x = this.canvas.width - player.width;
    }
  }

  checkCollisions() {
    for (let i = this.gameService.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.gameService.projectiles[i];
      for (let j = this.gameService.enemies.length - 1; j >= 0; j--) {
        const enemy = this.gameService.enemies[j];
        if (this.gameService.detectCollision(projectile, enemy)) {
          // Remove collided enemy and projectile
          this.gameService.enemies.splice(j, 1);
          this.gameService.projectiles.splice(i, 1);

          // +100 points for a hit
          this.points += 100;

          // Respawn a new enemy if the current count is less than the maximum
          if (this.gameService.enemies.length < this.ufoCount) {
            this.gameService.respawnEnemy(this.canvas.width, this.canvas.height);
          }
          break;
        }
      }
    }
  }


  startTimer() {
    const timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(timerInterval);
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    let finalScore = this.points;
    finalScore = finalScore / (this.initialTime / 60);
    finalScore = finalScore - 50 * (this.ufoCount - 1);

    // API call to save the score
    const scoreData = {
      punctuation: Math.max(0, Math.round(finalScore)),
      ufos: this.ufoCount,
      disposedTime: this.initialTime,
    };
    console.log('End of game, sending scoreData:', scoreData);

    this.scoresService.postRecord(scoreData).subscribe({
      next: (response) => {
        alert(`Score saved! Final Score: ${scoreData.punctuation}`);
      },
      error: (error) => {
        console.error('Error saving score:', error);
        alert('Failed to save the score. Please try again.');
      },
    });
  }
}
