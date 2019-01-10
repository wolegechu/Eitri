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

  constructor(id: number, p1: Point, p2: Point) {
    super(id);

    // new two Joint
    const joint1 = ViewFactory.CreateJoint(p1);
    const joint2 = ViewFactory.CreateJoint(p2);
    this.jointIDs.push(joint1.id);
    this.jointIDs.push(joint2.id);
    joint1.wallIDs.push(this.id);
    joint2.wallIDs.push(this.id);

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
}