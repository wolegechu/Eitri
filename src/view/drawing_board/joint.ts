import {fabric} from 'fabric';

import {Point} from '../../utils/index';

import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';
import {JointExportedProperties, ViewObject} from './view_object';
import {Wall} from './wall';

const JOINT_RADIUS = 8.0;

export class Joint extends ViewObject {
  wallIDs: number[] = [];
  position: Point;
  view: fabric.Circle;

  constructor(id: number, pos: Point) {
    super(id);

    this.position = pos;
    this.view = new fabric.Circle({
      left: pos.x - JOINT_RADIUS,
      top: pos.y - JOINT_RADIUS,
      strokeWidth: 5,
      radius: JOINT_RADIUS,
      fill: '#B0B0B0',
      stroke: '#B0B0B0',
      selectable: false,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    const canvas = ViewCanvas.GetInstance();
    canvas.OnObjectMove((e) => this.OnObjectMove(e));
  }

  ExportProperties(): JointExportedProperties {
    const properties: JointExportedProperties = {
      x: this.position.x,
      y: this.position.y
    };
    return properties;
  }

  ImportProperties(props: import("/Users/QZQ/FSS/Designer/src/view/drawing_board/view_object").ExportedProperties): void {
    throw new Error("Method not implemented.");
  }
  
  RemoveWallID(id: number) {
    const index = this.wallIDs.indexOf(id);
    if (index !== -1) this.wallIDs.splice(index, 1);
    if (0 === this.wallIDs.length) this.RemoveSelf();
  }

  SetPosition(point: Point) {
    this.position = point;
    this.UpdateViewPosition();
  }

  Merge(other: Joint) {
    // special case: same joint
    if (this === other) return;

    other.wallIDs.forEach(id => {
      const wall = ViewFactory.GetViewObject(id) as Wall;
      const index = wall.jointIDs.indexOf(other.id);
      wall.jointIDs[index] = this.id;
    });
    this.wallIDs = this.wallIDs.concat(other.wallIDs);
    other.RemoveSelf();

    // special case: this and other has a common wall.
    for (let i = this.wallIDs.length - 1; i >= 0; --i) {
      const wall = ViewFactory.GetViewObject(this.wallIDs[i]) as Wall;
      if (wall.jointIDs[0] === wall.jointIDs[1]) {
        wall.RemoveSelf();
      }
    }
  }

  private OnObjectMove(e: fabric.IEvent) {
    if (e.target !== this.view) return;
    console.debug('On Joint Move');
    this.UpdatePosition();
    this.UpdateWalls();
  }

  private UpdateWalls() {
    this.wallIDs.forEach(id => {
      const wall = ViewFactory.GetViewObject(id) as Wall;
      wall.UpdatePosition();
    });
  }

  // Update the Position property based on this.view
  private UpdatePosition() {
    this.position.x = this.view.left + JOINT_RADIUS;
    this.position.y = this.view.top + JOINT_RADIUS;
  }

  private UpdateViewPosition() {
    this.view.set({
      left: this.position.x - JOINT_RADIUS,
      top: this.position.y - JOINT_RADIUS,
    });
    this.view.setCoords();
    this.UpdateWalls();
    ViewCanvas.GetInstance().Render();
  }
}
