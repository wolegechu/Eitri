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

  get length(): number{
    const joint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;
    
    return 1;
  }
  // type: int;
  // rooms: ID[];
  // doors: ID[];

  constructor(id: number, point1: Point|Joint, point2: Point|Joint) {
    super(id);

    const p1 = this.GetOrCreateJoint(point1).position;
    const p2 = this.GetOrCreateJoint(point2).position;

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