export interface Point {
  x: number;
  y: number;
}

export function GetDistance(a: Point, b: Point) {
  return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}
