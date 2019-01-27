import {ImageHandle} from '../../ImageManager';
import {Point} from '../../utils/index';
import {GetDistanceOfPoint2LineSegment, GetDistanceOfPoint2Point} from '../../utils/math';

import {Accessory} from './accessory';
import {Background} from './background';
import {ViewCanvas} from './canvas';
import {Joint} from './joint';
import {Room} from './room';
import {ObjectOptions, ViewObject} from './view_object';
import {Wall} from './wall';


const idObjectMap = new Map<number, ViewObject>();
const viewObjectMap = new Map<fabric.Object, ViewObject>();
let idCount = 1;

function GetNewID(): number {
  while (idObjectMap.has(idCount)) idCount += 1;
  return idCount;
}

export function CreateJoint(pos: Point): Joint {
  const id = GetNewID();
  const joint = new Joint(id, {_position: pos});
  AddObject(joint);
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
  AddObject(wall);
  return wall;
}

export function CreateAccessory(img: ImageHandle): Accessory {
  const id = GetNewID();
  const accessory = new Accessory(id, {imgHandle: ImageHandle[img]});
  AddObject(accessory);
  return accessory;
}

export function CreateRoom(edges: Wall[], firstVertex: Joint): Room {
  const id = GetNewID();
  const room = new Room(
      id, {firstJointID: firstVertex.id, wallIDs: edges.map(v => v.id)});
  AddObject(room);
  return room;
}

export function CreateBackground(htmlImage: HTMLImageElement) {
  const id = GetNewID();
  const back = new Background(id, htmlImage);
  AddObject(back);
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
  if (!idObjectMap.has(obj.id)) return;
  idObjectMap.delete(obj.id);
  viewObjectMap.delete(obj.view);
  ViewCanvas.GetInstance().Remove(obj);
}

export function AddObject(obj: ViewObject) {
  if (idObjectMap.has(obj.id)) return;
  idObjectMap.set(obj.id, obj);
  viewObjectMap.set(obj.view, obj);
  ViewCanvas.GetInstance().Add(obj);
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
    if (!obj.ToJson) continue;
    json.push({id: obj.id, type: obj.typeName, content: obj.ToJson()});
  }
  return JSON.stringify(json);
}

export function ImportFromJson(json: string) {
  const constructorMap =
      new Map<string, {new (id: number, optin: ObjectOptions): ViewObject}>();
  constructorMap.set(Accessory.typeName, Accessory);
  constructorMap.set(Background.typeName, Background);
  constructorMap.set(Joint.typeName, Joint);
  constructorMap.set(Room.typeName, Room);
  constructorMap.set(Wall.typeName, Wall);

  Clear();

  const data: JsonItemData[] = JSON.parse(json);
  for (const item of data) {
    const constructor = constructorMap.get(item.type);
    const obj = new constructor(item.id, item.content);
    AddObject(obj);
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