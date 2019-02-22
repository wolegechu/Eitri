import {fabric} from 'fabric';

import {Point} from '../../utils/index';

import {CanvasManager} from './canvas_manager';
import {RenderOrderConfig} from '../../config/render_order_config';
import * as ViewFactory from './view_factory';
import {ObjectOptions, ViewObject} from './view_object';
import {Wall} from './wall';

const JOINT_RADIUS = 10;

interface JointOption extends ObjectOptions {
  _wallIDs?: number[];
  _position?: {x: number, y: number};
}


export class Joint extends ViewObject {
  static typeName = 'joint';
  get typeName() {
    return Joint.typeName;
  }
  get renderOrder() {
    return RenderOrderConfig.JOINT;
  }

  private _wallIDs: number[] = [];
  private _position: Point = new Point(0, 0);

  get wallIDs() {
    return this._wallIDs;
  }
  get position() {
    return this._position;
  }

  view: fabric.Circle;

  constructor(id: number, option: JointOption) {
    super(id);

    this.view = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: this.position.x,
      top: this.position.y,
      strokeWidth: 5,
      radius: JOINT_RADIUS,
      fill: '#B0B0B0',
      stroke: '#B0B0B0',
      selectable: false,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    CanvasManager.OnObjectMove((e) => this.OnObjectMove(e));

    this.Set(option);
  }

  ToJson(): ObjectOptions {
    return Object.assign({}, this, {view: undefined});
  }

  UpdateView(): void {
    this.UpdateViewByPosition();
    this.view.setCoords();
    CanvasManager.Render();
  }

  RemoveWallID(id: number) {
    const index = this.wallIDs.indexOf(id);
    if (index !== -1) this.wallIDs.splice(index, 1);
    if (0 === this.wallIDs.length) this.RemoveSelf();
  }

  AddWallID(id: number) {
    const index = this.wallIDs.indexOf(id);
    if (index === -1) this.wallIDs.push(id);
  }

  SetPosition(point: Point) {
    this._position = point;
    this.UpdateWalls();
    this.UpdateView();
  }

  Merge(other: Joint) {
    // special case: same joint
    if (this === other) return;

    other.wallIDs.forEach(id => {
      const wall = ViewFactory.GetViewObject(id) as Wall;
      const index = wall.jointIDs.indexOf(other.id);
      wall.jointIDs[index] = this.id;
    });
    this._wallIDs = this.wallIDs.concat(other.wallIDs);
    other.RemoveSelf();

    // special case: this and other has a common wall.
    for (let i = this.wallIDs.length - 1; i >= 0; --i) {
      const wall = ViewFactory.GetViewObject(this.wallIDs[i]) as Wall;
      if (wall.jointIDs[0] === wall.jointIDs[1]) {
        wall.RemoveSelf();
      }
    }
  }

  protected Set(option: JointOption): void {
    if (option._position !== undefined) {
      const p = option._position;
      this._position = new Point(p.x, p.y);
    }
    if (option._wallIDs !== undefined) {
      this._wallIDs = option._wallIDs;
    }

    this.UpdateView();
  }

  private OnObjectMove(e: fabric.IEvent) {
    if (e.target !== this.view) return;
    console.debug('On Joint Move');
    // Update the Position property based on this.view
    this.SetPosition(new Point(this.view.left, this.view.top));
  }

  private UpdateWalls() {
    this.wallIDs.forEach(id => {
      const wall = ViewFactory.GetViewObject(id) as Wall;
      if (wall) wall.OnJointMove();
    });
  }

  private UpdateViewByPosition() {
    this.view.set({
      left: this.position.x,
      top: this.position.y,
    });
  }
}
