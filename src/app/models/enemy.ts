export class Enemy {
  position = { x: 0, y: 0 };
  velocity = { x: 5, y: 0 };
  width = 65;
  height = 65;
  range = 170;
  destroyed = false;
  initialX: number;
  image = new Image();

  constructor(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.initialX = x;
    this.image.src = '../assets/ufo.png';
  }
}
