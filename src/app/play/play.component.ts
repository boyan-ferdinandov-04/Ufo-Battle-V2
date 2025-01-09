import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { GameService } from '../game.service';
import { ScoresService } from "../scores.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  points = 0;
  remainingTime = 60; // Default game duration
  ufoCount = 1; // Default UFO count
  initialTime = 60; // To track the starting time
  private scoreSaved = false; // Prevent duplicate saves

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private keysPressed: { [key: string]: boolean } = {};

  constructor(private gameService: GameService, private scoresService: ScoresService) {}

  ngOnInit(): void {
    const savedUfoCount = localStorage.getItem('ufoCount');
    const savedGameTime = localStorage.getItem('gameTime');

    if (savedUfoCount) this.ufoCount = parseInt(savedUfoCount, 10);
    if (savedGameTime) {
      this.remainingTime = parseInt(savedGameTime, 10);
      this.initialTime = this.remainingTime;
    }
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Initialize or reset the game state:
    this.gameService.enemies = [];
    this.gameService.initializePlayer(this.canvas.width, this.canvas.height);

    // Spawn UFOs
    for (let i = 0; i < this.ufoCount; i++) {
      this.gameService.spawnEnemy(this.canvas.width, this.canvas.height);
    }

    // Start the timer and game loop
    this.startTimer();
    this.startGameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.keysPressed[event.key] = true;

    // Shoot projectiles when pressing the up arrow
    if (event.key === 'ArrowUp' && this.gameService.projectiles.length === 0) {
      this.gameService.fireProjectile();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.keysPressed[event.key] = false;
  }

  startGameLoop(): void {
    const update = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Player movement
      this.handlePlayerMovement();

      // Draw the player
      const player = this.gameService.player!;
      this.context.drawImage(
        player.image,
        player.position.x,
        player.position.y,
        player.width,
        player.height
      );

      // Move and draw enemies
      this.gameService.enemies.forEach((enemy) => {
        enemy.position.x += enemy.velocity.x;
        enemy.position.y += enemy.velocity.y;

        // Boundary collision for enemies
        if (enemy.position.x < 0 || enemy.position.x + enemy.width > this.canvas.width) {
          enemy.velocity.x = -enemy.velocity.x;
        }
        if (enemy.position.y < 0 || enemy.position.y + enemy.height > this.canvas.height) {
          enemy.velocity.y = -enemy.velocity.y;
        }

        this.context.drawImage(
          enemy.image,
          enemy.position.x,
          enemy.position.y,
          enemy.width,
          enemy.height
        );
      });

      // Move and draw projectiles
      this.gameService.projectiles.forEach((projectile, index) => {
        projectile.position.y += projectile.velocity.y;

        // Remove projectile if out of bounds
        if (projectile.position.y + projectile.height < 0) {
          this.gameService.projectiles.splice(index, 1);
          this.points -= 25; // Penalty for missed shots
        }

        this.context.drawImage(
          projectile.image,
          projectile.position.x,
          projectile.position.y,
          projectile.width,
          projectile.height
        );
      });

      // Collision detection
      this.checkCollisions();

      // Continue the game loop if time is left
      if (this.remainingTime > 0) {
        requestAnimationFrame(update);
      }
    };

    update();
  }

  handlePlayerMovement(): void {
    const player = this.gameService.player!;
    if (this.keysPressed['ArrowRight']) {
      player.velocity.x = player.speed;
    } else if (this.keysPressed['ArrowLeft']) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;
    }

    // Update position and keep the player within the canvas
    player.position.x += player.velocity.x;
    if (player.position.x < 0) player.position.x = 0;
    if (player.position.x + player.width > this.canvas.width) {
      player.position.x = this.canvas.width - player.width;
    }
  }

  checkCollisions(): void {
    for (let i = this.gameService.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.gameService.projectiles[i];
      for (let j = this.gameService.enemies.length - 1; j >= 0; j--) {
        const enemy = this.gameService.enemies[j];
        if (this.gameService.detectCollision(projectile, enemy)) {
          this.gameService.playExplosionAnimation(
            this.context,
            enemy.position.x + enemy.width / 2,
            enemy.position.y + enemy.height / 2
          );

          // Remove collided entities and award points
          this.gameService.enemies.splice(j, 1);
          this.gameService.projectiles.splice(i, 1);
          this.points += 100;

          // Respawn enemies if needed
          if (this.gameService.enemies.length < this.ufoCount) {
            this.gameService.respawnEnemy(this.canvas.width, this.canvas.height);
          }

          break;
        }
      }
    }
  }

  startTimer(): void {
    const timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(timerInterval);
        this.endGame();
      }
    }, 1000);
  }

  saveScore(): void {
    if (this.scoreSaved) {
      alert('Score has already been saved!');
      return;
    }

    const finalScoreData = {
      punctuation: Math.max(0, Math.round(this.calculateFinalScore())),
      ufos: this.ufoCount,
      disposedTime: this.initialTime,
    };

    this.scoresService.postRecord(finalScoreData).subscribe({
      next: () => {
        this.scoreSaved = true;
        alert(`Score saved! Final Score: ${finalScoreData.punctuation}`);
      },
      error: () => alert('Failed to save the score. Please try again.'),
    });
  }

  calculateFinalScore(): number {
    let finalScore = this.points;
    finalScore /= this.initialTime / 60;
    finalScore -= 50 * (this.ufoCount - 1);
    return finalScore;
  }

  endGame(): void {
    alert('Game over! Click the "Save Score" button to save your score.');
  }
}
