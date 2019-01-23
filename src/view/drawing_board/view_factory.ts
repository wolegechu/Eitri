import {ImageHandle} from '../../ImageManager';
import {Point} from '../../utils/index';
import {GetDistanceOfPoint2LineSegment, GetDistanceOfPoint2Point} from '../../utils/math';

import {Accessory} from './accessory';
import {Background} from './background';
import {Joint} from './joint';
import {Room} from './room';
import {ObjectOptions, ViewObject} from './view_object';
import {Wall} from './wall';


const idObjectMap = new Map<number, ViewObject>();
const viewObjectMap = new Map<fabric.Object, ViewObject>();
let idCount = 0;

function GetNewID(): number {
  idCount += 1;
  return idCount;
}

export function CreateJoint(pos: Point): Joint {
  const id = GetNewID();
  const joint = new Joint(id, {_position: pos});
  idObjectMap.set(joint.id, joint);
  viewObjectMap.set(joint.view, joint);
  return joint;
}

export function CreateWall(p1: Point|Joint, p2: Point|Joint): Wall {
  let joint1, joint2;
  if (p1 instanceof Point) {
    joint1 = CreateJoint(p1);
  } else {
    joint1 = p1;
  }

  if (p2 instanceof Point) {
    joint2 = CreateJoint(p2);
  } else {
    joint2 = p2;
  }

  const id = GetNewID();

  const wall = new Wall(id, {_jointIDs: [joint1.id, joint2.id]});
  idObjectMap.set(wall.id, wall);
  viewObjectMap.set(wall.view, wall);
  return wall;
}

export function CreateAccessory(img: ImageHandle): Accessory {
  const id = GetNewID();
  const accessory = new Accessory(id, {imgHandle: ImageHandle[img]});
  idObjectMap.set(accessory.id, accessory);
  viewObjectMap.set(accessory.view, accessory);
  return accessory;
}

export function CreateRoom(edges: Wall[], firstVertex: Joint): Room {
  const id = GetNewID();
  const room = new Room(
      id, {firstJointID: firstVertex.id, wallIDs: edges.map(v => v.id)});
  idObjectMap.set(room.id, room);
  viewObjectMap.set(room.view, room);
  return room;
}

export function CreateBackground(htmlImage: HTMLImageElement) {
  const id = GetNewID();
  const back = new Background(id, htmlImage);
  idObjectMap.set(back.id, back);
  viewObjectMap.set(back.view, back);
  return back;
}

export function GetViewObject(id: number): ViewObject {
  return idObjectMap.get(id);
}

export function GetViewObjectWithView(view: fabric.Object) {
  return viewObjectMap.get(view);
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
  for (const obj of idObjectMap.values()) {
    if (obj instanceof constructor) ret.push(obj);
  }

  return ret;
}

export function RemoveObject(obj: ViewObject) {
  idObjectMap.delete(obj.id);
  viewObjectMap.delete(obj.view);
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

  for (const obj of idObjectMap.values()) {
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

  for (const obj of idObjectMap.values()) {
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

type JsonItemData = {
  id: number,
  type: string,
  content: ObjectOptions
};

export function ExportToJson(): string {
  const json: JsonItemData[] = [];

  for (const obj of idObjectMap.values()) {
    const item = {id: obj.id, type: '', content: obj.ToJson()};
    if (obj instanceof Accessory) {
      item.type = Accessory.typeName;
    } else if (obj instanceof Joint) {
      item.type = Joint.typeName;
    } else if (obj instanceof Room) {
      item.type = Room.typeName;
    } else if (obj instanceof Wall) {
      item.type = Wall.typeName;
    } else if (obj instanceof Background) {
      continue;
    } else {
      console.assert(false, 'object don\'t have rule to json:');
      console.log(obj);
    }

    json.push(item);
  }
  return JSON.stringify(json);
}

export function ImportToJson(json: string) {
  Clear();
  const data: JsonItemData[] = JSON.parse(json);
  for (const item of data) {
    let obj;
    switch (item.type) {
      case Accessory.typeName:
        obj = new Accessory(item.id, item.content);
        break;
      case Joint.typeName:
        obj = new Joint(item.id, item.content);
        break;
      case Room.typeName:
        obj = new Room(item.id, item.content);
        break;
      case Wall.typeName:
        obj = new Wall(item.id, item.content);
        break;
      default:
        console.assert(false, 'unkonw type:' + item.type);
        console.log(item);
        break;
    }

    idObjectMap.set(obj.id, obj);
    viewObjectMap.set(obj.view, obj);
  }

  for (const obj of idObjectMap.values()) {
    obj.UpdateView();
  }
}

/**
 * Clear the canvas. Remove all ViewObjects
 */
function Clear(): void {
  const deleteJobs = [];
  for (const obj of idObjectMap.values()) {
    deleteJobs.push(obj);
  }
  deleteJobs.forEach(obj => obj.RemoveSelf());
}