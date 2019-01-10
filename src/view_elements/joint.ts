import {fabric} from 'fabric';
import {Point} from '../utils/index';
import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';
import {ViewObject} from './view_object';
import {Wall} from './wall';

const JOINT_RADIUS = 12.0;

export class Joint extends ViewObject {
  wallIDs: number[] = [];
  position: Point;
  protected view: fabric.Circle;

  constructor(id: number, pos: Point) {
    super(id);

    this.position = pos;
    this.view = new fabric.Circle({
      left: pos.x - JOINT_RADIUS,
      top: pos.y - JOINT_RADIUS,
      strokeWidth: 5,
      radius: JOINT_RADIUS,
      fill: '#fff',
      stroke: '#666',
    });
    this.view.hasControls = false;

    const canvas = ViewCanvas.GetInstance();
    canvas.Add(this.view);
    canvas.OnObjectMove((e) => this.OnObjectMove(e));
  }

  private OnObjectMove(e: fabric.IEvent) {
    if (e.target !== this.view) return;

    this.UpdatePosition();
    this.UpdateWalls();
  }

  private UpdateWalls() {
    this.wallIDs.forEach(id => {
      const wall = ViewFactory.GetViewObject(id) as Wall;
      wall.UpdateViewPosition();
    });
  }

  // Update the Position property based on this.view
  private UpdatePosition() {
    this.position.x = this.view.left + JOINT_RADIUS;
    this.position.y = this.view.top + JOINT_RADIUS;
  }
}
