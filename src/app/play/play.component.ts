import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';

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

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    const savedUfoCount = localStorage.getItem('ufoCount');
    const savedGameTime = localStorage.getItem('gameTime');
    if (savedUfoCount) this.ufoCount = parseInt(savedUfoCount, 10);
    if (savedGameTime) this.remainingTime = parseInt(savedGameTime, 10);
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.gameService.initializePlayer(this.canvas.width, this.canvas.height);
    this.startGameLoop();
  }

  startGameLoop() {
    const update = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const player = this.gameService.player!;
      player.position.x += player.velocity.x;
      this.context.drawImage(player.image, player.position.x, player.position.y, player.width, player.height);

      requestAnimationFrame(update);
    };

    update();
  }
}
