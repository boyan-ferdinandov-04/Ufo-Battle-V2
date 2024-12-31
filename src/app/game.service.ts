import { Injectable } from '@angular/core';
import { Player } from "./models/player";
import { Projectile } from './models/projectile';
import { Enemy } from './models/enemy';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  player: Player | null = null;
  projectiles: Projectile[] = [];
  enemies: Enemy[] = [];
  points = 0;

  initializePlayer(canvasWidth: number, canvasHeight: number) {
    this.player = new Player(canvasWidth, canvasHeight);
  }

  spawnEnemy(canvasWidth: number, canvasHeight: number) {
    const x = 100 + Math.random() * (canvasWidth - 200);
    const y = 100 + Math.random() * (canvasHeight / 2 - 100);
    const enemy = new Enemy(x, y);
    this.enemies.push(enemy);
  }

  detectCollision(projectile: Projectile, enemy: Enemy): boolean {
    return (
      projectile.position.x < enemy.position.x + enemy.width &&
      projectile.position.x + projectile.width > enemy.position.x &&
      projectile.position.y < enemy.position.y + enemy.height &&
      projectile.position.y + projectile.height > enemy.position.y
    );
  }
}
