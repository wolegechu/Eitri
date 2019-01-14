import {Point} from '.';


export function Point2PointDistance(a: Point, b: Point) {
  return a.distance(b);
}

export function Point2SegmentDistance(
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

export function Point2SegmentNearestPoint(
    p: Point, line: {p1: Point, p2: Point}): Point {
  const a = line.p1, b = line.p2;
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