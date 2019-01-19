import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../CONFIG';
import {Point} from '../../utils/index';
import {GetDistanceOfPoint2LineSegment, GetDistanceOfPoint2Point} from '../../utils/math';

import {Accessory} from './accessory';
import {Joint} from './joint';
import {Room} from './room';
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

export function CreateAccessory(pos: Point, img: HTMLImageElement): Accessory {
  const id = GetNewID();
  const viewWindle = new Accessory(id, pos, img);
  viewMap.set(viewWindle.id, viewWindle);
  return viewWindle;
}

export function CreateRoom(edges: Wall[], vertex: Joint): Room {
  const id = GetNewID();
  const room = new Room(id, edges, vertex);
  viewMap.set(room.id, room);
  return room;
}

export function GetViewObject(id: number): ViewObject {
  return viewMap.get(id);
}

/**
 * get the objects of type T.
 * because of rubbish js/ts, we hava to use this uncomfortable tricky method.
 * https://github.com/Microsoft/TypeScript/issues/5236
 */
export function GetViewObjectsWithType<T>(
    // tslint:disable-next-line:no-any
    constructor: {new (...args: any[]): T}): T[] {
  const ret: T[] = [];
  for (const obj of viewMap.values()) {
    if (obj instanceof constructor) ret.push(obj);
  }

  return ret;
}

export function RemoveObject(id: number) {
  viewMap.delete(id);
}

/**
 * get the joint nearest to the position.
 *
 * @param pos the position used to calculate distance
 * @param exception ignore the joints in this array
 * @param distanceUpperBound if the nearest distance bigger than this, return
 * null
 */
export function GetNearestJoint(
    pos: Point, exception: Joint[] = [], distanceUpperBound = 1e10): Joint {
  let min = distanceUpperBound;
  let nearestJoint: Joint = null;

  for (const obj of viewMap.values()) {
    if (!(obj instanceof Joint)) continue;
    if (-1 !== exception.indexOf(obj)) continue;

    const dis = GetDistanceOfPoint2Point(obj.position, pos);
    if (dis <= min) {
      min = dis;
      nearestJoint = obj;
    }
  }

  return nearestJoint;
}

/**
 * get the wall nearest to the position.
 *
 * @param pos the position used to calculate distance
 * @param exception ignore the walls in this array
 * @param distanceUpperBound if the nearest distance bigger than this, return
 * null
 */
export function GetNearestWall(
    pos: Point, exception: Wall[] = [], distanceUpperBound = 1e10): Wall {
  let min = distanceUpperBound;
  let nearestWall: Wall = null;

  for (const obj of viewMap.values()) {
    if (!(obj instanceof Wall)) continue;
    if (-1 !== exception.indexOf(obj)) continue;

    const p1 = (GetViewObject(obj.jointIDs[0]) as Joint).position;
    const p2 = (GetViewObject(obj.jointIDs[1]) as Joint).position;
    const dis = GetDistanceOfPoint2LineSegment(pos, {p1, p2});
    if (dis <= min) {
      min = dis;
      nearestWall = obj;
    }
  }

  return nearestWall;
}

export function GetObjectByFabric(view: fabric.Object): ViewObject {
  for (const obj of viewMap.values()) {
    if (view === obj.view) {
      return obj;
    }
  }
  return null;
}