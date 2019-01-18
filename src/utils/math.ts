import {Point} from '.';


export function GetDistanceOfPoint2Point(a: Point, b: Point) {
  return a.distance(b);
}

export function GetDistanceOfPoint2LineSegment(
    p: Point, line: {p1: Point, p2: Point}): number {
  const a = line.p1, b = line.p2;
  const vec1 = p.clone().subtract(a);
  const vec2 = b.clone().subtract(a);
  const ret = vec1.dot(vec2) / vec2.lengthSq();
  if (ret > 1) {
    return p.distance(b);
  } else if (ret < 0) {
    return p.distance(a);
  } else {
    const normVec2 = vec2.clone().norm();
    return Math.abs(vec1.cross(normVec2));
  }
}

/**
 * return the point on Line Segment 'ab' closest to the point 'p'.
 */
export function GetClosestPointOnSegment2Point(
    p: Point, line: {a: Point, b: Point}): Point {
  const a = line.a, b = line.b;
  const vec1 = p.clone().subtract(a);
  const vec2 = b.clone().subtract(a);
  const ret = vec1.dot(vec2) / vec2.lengthSq();
  if (ret > 1) {
    return b;
  } else if (ret < 0) {
    return a;
  } else {
    const addition = vec2.clone().multiplyScalar(ret);
    return a.clone().add(addition);
  }
}

/**
 * check if the order of vertexes array is clockwise.
 * only Convex Polygon can use this function.
 * Concave Polygon may get wrong result.
 * @param verts the vertexes form the Polygon.
 */
export function PolygonIsClockWise(verts: Point[]) {
  for (let i = 0; i <= verts.length - 3; ++i) {
    const a = verts[i + 0].clone();
    const b = verts[i + 1].clone();
    const c = verts[i + 2].clone();
    const vec1 = b.clone().subtract(a);
    const vec2 = c.clone().subtract(a);
    const ret = vec2.cross(vec1);
    if (ret > 1e-8)
      return true;
    else if (ret < -1e-8)
      return false;
  }
  return false;  // not a polygon
}