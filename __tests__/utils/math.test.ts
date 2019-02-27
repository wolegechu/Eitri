import Flatten from 'flatten-js';

import * as Math from '../../src/utils';

describe('math', () => {
  test('2 point distance', () => {
    const dis = Math.GetDistanceOfPoint2Point(
        new Flatten.Point(0, 0),
        new Flatten.Point(3, 4),
    );
    expect(dis).toBeCloseTo(5);
  });

  test('point to segment distance 1', () => {
    const dis = Math.GetDistanceOfPoint2LineSegment(new Flatten.Point(0, 0), {
      ps: new Flatten.Point(3, 1000),
      pe: new Flatten.Point(3, 4),
    });
    expect(dis).toBeCloseTo(5);
  });

  test('point to segment distance 2', () => {
    const dis = Math.GetDistanceOfPoint2LineSegment(new Flatten.Point(0, 0), {
      ps: new Flatten.Point(3, 1000),
      pe: new Flatten.Point(3, -4),
    });
    expect(dis).toBeCloseTo(3);
  });

  test('closest point on segment to n point', () => {
    const point = Math.GetClosestPointOnSegment2Point(new Flatten.Point(0, 0), {
      ps: new Flatten.Point(3, 1000),
      pe: new Flatten.Point(3, -4),
    });
    const ret = new Flatten.Point(3, 0);
    expect(point.equalTo(ret)).toBe(true);
  });
});