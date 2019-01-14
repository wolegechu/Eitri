import {Point} from '../../utils/index';
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