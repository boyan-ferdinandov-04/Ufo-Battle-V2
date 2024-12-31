export class Projectile {
  position = { x: 0, y: 0 };
  velocity = { x: 0, y: -10 };
  width = 20;
  height = 30;
  image = new Image();

  constructor(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.image.src = '../assets/missile.png';
  }
}
