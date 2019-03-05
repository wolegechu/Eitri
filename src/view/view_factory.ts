import {Point} from '../utils/index';

import {Accessory} from './canvas_components/accessory';
import {Background} from './canvas_components/background';
import {FurnitureGroup, FurnitureGroupOption} from './canvas_components/furniture_group';
import {Joint} from './canvas_components/joint';
import {Pedestal} from './canvas_components/pedestal';
import {Room} from './canvas_components/room';
import {ObjectOptions, ViewObject} from './canvas_components/view_object';
import {Wall} from './canvas_components/wall';
import {CanvasManager} from './canvas_manager';


export class ViewFactory {
  private static idObjectMap = new Map<number, ViewObject>();
  private static viewObjectMap = new Map<fabric.Object, ViewObject>();
  private static idCount = 1;

  /*********************** Functions for Create: start ************************/
  static CreateJoint(pos: Point): Joint {
    const id = this.GetNewID();
    const joint = new Joint(id, {_position: pos});
    this.AddObject(joint);
    return joint;
  }

  static CreateWall(p1: Point|Joint, p2: Point|Joint): Wall {
    let joint1, joint2;
    if (p1 instanceof Point) {
      joint1 = this.CreateJoint(p1);
    } else {
      joint1 = p1;
    }

    if (p2 instanceof Point) {
      joint2 = this.CreateJoint(p2);
    } else {
      joint2 = p2;
    }

    const id = this.GetNewID();

    const wall = new Wall(id, {_jointIDs: [joint1.id, joint2.id]});
    this.AddObject(wall);
    return wall;
  }

  static CreateAccessory(img: string): Accessory {
    const id = this.GetNewID();
    const accessory = new Accessory(id, {imgHandle: img});
    this.AddObject(accessory);
    return accessory;
  }

  static CreateRoom(vertexes: Joint[]): Room {
    const id = this.GetNewID();
    const room = new Room(id, {jointIDs: vertexes.map(v => v.id)});
    this.AddObject(room);
    return room;
  }

  static CreatePedestal(): Pedestal {
    const id = this.GetNewID();
    const obj = new Pedestal(id, {});
    this.AddObject(obj);
    return obj;
  }

  static CreateFurnitureGroup(option: FurnitureGroupOption) {
    const id = this.GetNewID();
    const obj = new FurnitureGroup(id, option);
    this.AddObject(obj);
    return obj;
  }

  static CreateBackground(img: HTMLImageElement) {
    const id = this.GetNewID();
    const back = new Background(id, {htmlImage: img});
    this.AddObject(back);
    return back;
  }
  /*********************** Functions for Create: end ************************/

  /*********************** Functions for Get: start ************************/
  static GetViewObject(id: number): ViewObject {
    return this.idObjectMap.get(id);
  }

  static GetViewObjectWithView(view: fabric.Object) {
    return this.viewObjectMap.get(view);
  }

  /**
   * get the objects of type T.
   * because of rubbish js/ts, we hava to use this uncomfortable tricky method.
   * https://github.com/Microsoft/TypeScript/issues/5236
   */
  static GetViewObjectsWithType<T>(
      // tslint:disable-next-line:no-any
      theType: {new(...args: any[]): T}): T[] {
    const ret: T[] = [];
    for (const obj of this.idObjectMap.values()) {
      if (obj instanceof theType) ret.push(obj);
    }
    return ret;
  }

  /**
   * get the joint nearest to the position.
   *
   * @param pos the position used to calculate distance
   * @param exception ignore the joints in this array
   * @param distanceUpperBound if the nearest distance bigger than this, return
   * null
   */
  static GetNearestJoint(
      pos: Point, exception: Joint[] = [], distanceUpperBound = 1e10): Joint {
    let min = distanceUpperBound;
    let nearestJoint: Joint = null;

    const joints = this.GetViewObjectsWithType(Joint);
    for (const joint of joints) {
      if (-1 !== exception.indexOf(joint)) continue;

      const dis = joint.position.distanceTo(pos)[0];
      if (dis <= min) {
        min = dis;
        nearestJoint = joint;
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
  static GetNearestWall(
      pos: Point, exception: Wall[] = [], distanceUpperBound = 1e10): Wall {
    let min = distanceUpperBound;
    let nearestWall: Wall = null;

    const walls = this.GetViewObjectsWithType(Wall);
    for (const wall of walls) {
      if (-1 !== exception.indexOf(wall)) continue;

      const segment = wall.segment;
      if (!segment) continue;
      const dis = pos.distanceTo(segment)[0];
      if (dis <= min) {
        min = dis;
        nearestWall = wall;
      }
    }

    return nearestWall;
  }
  /*********************** Functions for Get: end ************************/

  static RemoveObject(obj: ViewObject) {
    if (!this.idObjectMap.has(obj.id)) return;
    this.idObjectMap.delete(obj.id);
    this.viewObjectMap.delete(obj.view);
    CanvasManager.Remove(obj.view);
  }

  static AddObject(obj: ViewObject) {
    if (this.idObjectMap.has(obj.id)) return;
    this.idObjectMap.set(obj.id, obj);
    this.viewObjectMap.set(obj.view, obj);
    CanvasManager.Add(obj.view, obj.renderOrder);
  }

  /**
   * Sometimes, in geometry, a joint is on a wall.
   * But in code, the joint is nothing to do with the wall.
   * It's caused by the drawing behaviour of users.
   * Problems like this are so many, which resolved here.
   */
  static Resolve() {
    this.SplitPointOnWall();
    this.RemoveDuplicateWall();
  }

  static ExportToJson(): string {
    // tslint:disable-next-line:no-any
    const json: { [key: string]: ObjectOptions[] } = {};

    for (const obj of this.idObjectMap.values()) {
      if (!obj.ToJson) continue;
      if (!json[obj.typeName]) {
        json[obj.typeName] = [];
      }
      json[obj.typeName].push(obj.ToJson());
    }
    return JSON.stringify(json);
  }

  static ImportFromJson(json: string) {
    const constructorMap =
        new Map<string, {new (id: number, optin: ObjectOptions): ViewObject}>();
    constructorMap.set(Accessory.typeName, Accessory);
    constructorMap.set(Background.typeName, Background);
    constructorMap.set(Joint.typeName, Joint);
    constructorMap.set(Room.typeName, Room);
    constructorMap.set(Wall.typeName, Wall);

    this.Clear();

    const data = JSON.parse(json);
    for (const type of Object.keys(data)) {
      const constructor = constructorMap.get(type);
      for (const item of data[type]) {
        const obj = new constructor(item.id, item);
        this.AddObject(obj);
      }
    }

    // It's realy dangerous to iterate a Map.values() directly.
    // Because of the modification of the Map may occur in for loop,
    // which could result in endless loop !!!
    // So we do like this:
    const contents: ViewObject[] = [];
    this.idObjectMap.forEach(o => contents.push(o));
    for (const obj of contents) {
      obj.UpdateView();
    }
  }

  /**
   * Clear the canvas. Remove all ViewObjects
   */
  private static Clear(): void {
    const deleteJobs = [];
    for (const obj of this.idObjectMap.values()) {
      deleteJobs.push(obj);
    }
    deleteJobs.forEach(obj => obj.RemoveSelf());
  }

  private static GetNewID(): number {
    while (this.idObjectMap.has(this.idCount)) {
      this.idCount += 1;
    }
    return this.idCount;
  }

  /**
   * return remove success or not.
   */
  private static TryRemoveDuplicateWall(): boolean {
    const walls = this.GetViewObjectsWithType(Wall);
    for (let i = 0; i < walls.length; ++i) {
      const wallA = walls[i];
      for (let j = i + 1; j < walls.length; ++j) {
        const wallB = walls[j];
        if (wallA.IsDuplicateTo(wallB)) {
          wallA.Merge(wallB);
          return true;
        }
      }
    }
    return false;
  }

  private static RemoveDuplicateWall() {
    while (this.TryRemoveDuplicateWall()) {
      // blank
    }
  }

  /**
   * return split success or not.
   */
  private static TrySplitWall(): boolean {
    const walls = this.GetViewObjectsWithType(Wall);
    for (let i = 0; i < walls.length; ++i) {
      const wall = walls[i];
      const joints = this.GetViewObjectsWithType(Joint);
      for (let j = 0; j < joints.length; ++j) {
        const joint = joints[j];
        if (wall.joint1 === joint || wall.joint2 === joint) {
          continue;
        }

        if (joint.IsOnwall(wall)) {
          wall.Split(joint);
          return true;
        }
      }
    }
    return false;
  }

  private static SplitPointOnWall() {
    while (this.TrySplitWall()) {
      // blank
    }
  }
}
