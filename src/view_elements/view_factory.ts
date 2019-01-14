import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../CONFIG';
import {Point} from '../utils/index';
import {Point2PointDistance, Point2SegmentDistance} from '../utils/math';

import {Joint} from './joint';
import {ViewObject} from './view_object';
import {Wall} from './wall';


export let viewMap = new Map<number, ViewObject>();
let idCount = 0;

function GetNewID(): number {
  idCount += 1;
  return idCount;
}

export function CreateJoint(pos: Point): Joint {
  const id = GetNewID();
  const joint = new Joint(id, pos);
  viewMap.set(id, joint);
  return joint;
}

export function CreateWall(p1: Point|Joint, p2: Point|Joint): Wall {
  const id = GetNewID();
  const wall = new Wall(id, p1, p2);
  viewMap.set(wall.id, wall);
  return wall;
}

export function GetViewObject(id: number): ViewObject {
  return viewMap.get(id);
}

export function RemoveObject(id: number) {
  viewMap.delete(id);
}

/**
 * get the joint grab the position.
 * ignore the joints in exception array.
 */
export function GetGrabJoint(pos: Point, exception: Joint[] = []): Joint {
  const nearestJoint = GetNearestJoint(pos, exception);
  if (nearestJoint &&
      Point2PointDistance(nearestJoint.position, pos) < GRAB_JOINT_DISTANCE) {
    return nearestJoint;
  } else {
    return null;
  }
}

/**
 * get the joint nearest to the point.
 * ignore the joints in exception array.
 */
function GetNearestJoint(point: Point, exception: Joint[] = []): Joint {
  let min = 1e10;
  let ret: Joint = null;

  for (const obj of viewMap.values()) {
    if (!(obj instanceof Joint)) continue;
    if (-1 !== exception.indexOf(obj)) continue;

    const dis = Point2PointDistance(obj.position, point);
    if (dis < min) {
      min = dis;
      ret = obj;
    }
  }

  return ret;
}

/**
 * get the wall grab the position.
 * ignore the wall in exception array.
 */
export function GetGrabWall(pos: Point, exception: Wall[] = []): Wall {
  const nearestWall = GetNearestWall(pos, exception);
  if (!nearestWall) return null;
  
  const p1 = (GetViewObject(nearestWall.jointIDs[0]) as Joint).position;
  const p2 = (GetViewObject(nearestWall.jointIDs[1]) as Joint).position;
  const dis = Point2SegmentDistance(pos, {p1, p2});
  if (dis < GRAB_WALL_DISTANCE) {
    return nearestWall;
  } else {
    return null;
  }
}

function GetNearestWall(pos: Point, exception: Wall[] = []): Wall {
  let min = 1e10;
  let ret: Wall = null;

  for (const obj of viewMap.values()) {
    if (!(obj instanceof Wall)) continue;
    if (-1 !== exception.indexOf(obj)) continue;

    const p1 = (GetViewObject(obj.jointIDs[0]) as Joint).position;
    const p2 = (GetViewObject(obj.jointIDs[1]) as Joint).position;
    const dis = Point2SegmentDistance(pos, {p1, p2});
    if (dis < min) {
      min = dis;
      ret = obj;
    }
  }

  return ret;
}

export function GetObjectByFabric(view: fabric.Object): ViewObject {
  for (const obj of viewMap.values()) {
    if (view === obj.view) {
      return obj;
    }
  }
  return null;
}