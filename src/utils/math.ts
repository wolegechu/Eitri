import Flatten from 'flatten-js';

import {Point} from '.';


export function GetDistanceOfPoint2Point(a: Point, b: Point): number {
  return a.distanceTo(b)[0];
}

export function GetDistanceOfPoint2LineSegment(
    p: Point, line: {ps: Point, pe: Point}): number {
  const segment = new Flatten.Segment(line.ps, line.pe);
  return p.distanceTo(segment)[0];
}

/**
 * return the point on Line Segment 'ab' closest to the point 'p'.
 */
export function GetClosestPointOnSegment2Point(
    p: Point, line: {ps: Point, pe: Point}): Point {
  const segment = new Flatten.Segment(line.ps, line.pe);
  return p.distanceTo(segment)[1].end;
}
