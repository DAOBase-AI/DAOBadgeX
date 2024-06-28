interface CircleConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class CircleUtil {
  origin: any;
  radius: any;

  constructor(config: CircleConfig, radius: number) {
    const { x, y, width, height } = config;
    this.origin = [x + width / 2, y + height / 2];
    this.radius = radius;

    console.log(this.origin, this.radius);

    const div = document.createElement('div');
    div.style.width = radius * 2 + 'px';
    div.style.height = radius * 2 + 'px';
    div.style.background = '#ff8080';
    div.style.top = this.origin[1] - radius + 'px';
    div.style.left = this.origin[0] - radius + 'px';
    div.className = ' absolute rounded-full z-50';
    document.body.appendChild(div);
  }

  isInner(x: number, y: number): boolean {
    const [ox, oy] = this.origin;

    console.log((x - ox) ** 2 + (y - oy) ** 2 <= this.radius ** 2);

    return (x - ox) ** 2 + (y - oy) ** 2 <= this.radius ** 2;
  }
}
