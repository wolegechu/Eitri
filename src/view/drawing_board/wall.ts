import {fabric} from 'fabric';

import {GetDistanceOfPoint2Point, Point} from '../../utils';

import {Accessory} from './accessory';
import {ViewCanvas} from './canvas';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {ViewObject, WallExportedProperties} from './view_object';

export class Wall extends ViewObject {
  jointIDs: number[] = [];
  accessoryIDs: number[] = [];
  width: number;
  view: fabric.Line;

  get length(): number {
    const joint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;

    const length = GetDistanceOfPoint2Point(joint1.position, joint2.position);
    return length;
  }
  // type: int;
  // rooms: ID[];
  // doors: ID[];

  constructor(id: number, point1: Point|Joint, point2: Point|Joint) {
    super(id);

    const p1 = this.GetOrCreateJoint(point1).position;
    const p2 = this.GetOrCreateJoint(point2).position;

    // new line
    this.view = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      strokeWidth: 3,
      stroke: 'red',
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;
  }

  /**
   * Split the wall to two walls through a joint between two ends of the wall.
   */
  Split(cutJoint: Joint) {
    const endJoint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const endJoint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;
    ViewFactory.CreateWall(cutJoint, endJoint1);
    ViewFactory.CreateWall(cutJoint, endJoint2);
    this.RemoveSelf();
  }

  ExportProperties(): WallExportedProperties {
    const properties:
        WallExportedProperties = {id: this.id, length: this.length};
    return properties;
  }

  UpdatePosition() {
    const joint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;

    this.view.set({
      'x1': joint1.position.x,
      'y1': joint1.position.y,
      'x2': joint2.position.x,
      'y2': joint2.position.y,
    });
    this.view.setCoords();

    this.accessoryIDs.forEach(id => {
      const obj = ViewFactory.GetViewObject(id) as Accessory;
      obj.OnWallMove();
    });
  }

  RemoveSelf() {
    super.RemoveSelf();
    this.jointIDs.forEach(jointID => {
      const joint = ViewFactory.GetViewObject(jointID) as Joint;
      joint.RemoveWallID(this.id);
    });
  }

  AddAccessoryID(id: number) {
    const index = this.accessoryIDs.indexOf(id);
    if (index === -1) this.accessoryIDs.push(id);
  }

  RemoveAccessoryID(id: number) {
    const index = this.accessoryIDs.indexOf(id);
    if (index !== -1) this.accessoryIDs.splice(index, 1);
  }

  private GetOrCreateJoint(point: Point|Joint): Joint {
    let joint: Joint;

    if (point instanceof Joint) {
      joint = (point as Joint);
    } else {
      joint = ViewFactory.CreateJoint(point);
    }
    joint.wallIDs.push(this.id);
    this.jointIDs.push(joint.id);
    return joint;
  }
}