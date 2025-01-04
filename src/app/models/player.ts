export class Player{
  position = {x: 0, y: 0};
  velocity = {x: 0, y: 0};
  width = 120
  height = 120
  speed = 10;
  image = new Image();

  constructor(canvasWidth: number, canvasHeight: number) {
    this.position.x = canvasWidth / 2 - this.width / 2;
    this.position.y = canvasHeight - this.height / 2;
    this.image.src = '../assets/spaceship.png';
  }
}
