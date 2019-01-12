
export interface Point {
  x: number;
  y: number;
}

export function GetDistance(a: Point, b: Point) {
  return Math.sqrt(
    (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
  );
}