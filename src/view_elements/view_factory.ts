import {Point} from '../utils/index';
import {GetDistance} from '../utils/math';

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

export function GetNearestJoint(point: Point): Joint {
  let min = 1e10;
  let ret: Joint = null;

  for (const obj of viewMap.values()) {
    if (!(obj instanceof Joint)) continue;
    const dis = GetDistance(obj.position, point);
    if (dis < min) {
      min = dis;
      ret = obj;
    }
  }

  return ret;
}

/**
 * get the joint nearest to the point except of a specific joint
 */
export function GetNearestJointExcept(except: Joint, point: Point): Joint {
  let min = 1e10;
  let ret: Joint = null;

  for (const obj of viewMap.values()) {
    if (!(obj instanceof Joint)) continue;
    if (obj === except) continue;
    const dis = GetDistance(obj.position, point);
    if (dis < min) {
      min = dis;
      ret = obj;
    }
  }

  return ret;
}
