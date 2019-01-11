import {fabric} from 'fabric';
import {Point} from '../utils/math';
import {ViewCanvas} from './canvas';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {ViewObject} from './view_object';

export class Wall extends ViewObject {
  jointIDs: number[] = [];
  width: number;
  view: fabric.Line;
  // type: int;
  // rooms: ID[];
  // doors: ID[];

  constructor(id: number, point1: Point, point2: Point|Joint) {
    super(id);

    let p1: Point, p2: Point;

    // First Joint
    p1 = point1;
    const joint1 = ViewFactory.CreateJoint(p1);
    this.jointIDs.push(joint1.id);
    joint1.wallIDs.push(this.id);

    // Second Joint
    let joint2: Joint;

    if (point2 instanceof Joint) {
      joint2 = (point2 as Joint);
      p2 = joint2.position;
    } else {
      p2 = point2 as Point;
      joint2 = ViewFactory.CreateJoint(p2);
    }
    joint2.wallIDs.push(this.id);
    this.jointIDs.push(joint2.id);

    // new line
    this.view = new fabric.Line(
        [p1.x, p1.y, p2.x, p2.y],
        {strokeWidth: 3, stroke: 'red', selectable: false, evented: false});
    this.view.hasControls = false;

    ViewCanvas.GetInstance().Add(this.view);
  }

  UpdateViewPosition() {
    const joint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;

    this.view.set({
      'x1': joint1.position.x,
      'y1': joint1.position.y,
      'x2': joint2.position.x,
      'y2': joint2.position.y,
    });
  }

  RemoveSelf() {
    super.RemoveSelf();
    this.jointIDs.forEach(jointID => {
      const joint = ViewFactory.GetViewObject(jointID) as Joint;
      joint.RemoveWallID(this.id);
    });
  }
}