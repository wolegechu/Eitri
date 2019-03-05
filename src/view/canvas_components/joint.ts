import {fabric} from 'fabric';

import {RenderOrderConfig} from '../../config/render_order_config';
import {Point} from '../../utils/index';
import {CanvasManager} from '../canvas_manager';
import {ViewFactory} from '../view_factory';

import {ObjectOptions, ViewObject} from './view_object';
import {Wall} from './wall';

const JOINT_RADIUS = 10;

export interface JointOption extends ObjectOptions {
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

  get walls(): Wall[] {
    return this._wallIDs.map(id => ViewFactory.GetViewObject(id) as Wall)
        .filter(val => !!val);
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
    const index = this._wallIDs.indexOf(id);
    if (index !== -1) this._wallIDs.splice(index, 1);
    if (0 === this._wallIDs.length) this.RemoveSelf();
  }

  AddWallID(id: number) {
    const index = this._wallIDs.indexOf(id);
    if (index === -1) this._wallIDs.push(id);
  }

  SetPosition(point: Point) {
    this._position = point;
    this.UpdateWalls();
    this.UpdateView();
  }

  Merge(other: Joint) {
    // special case: same joint
    if (this === other) return;

    other.walls.forEach(wall => {
      if (wall.joint1 === other) {
        wall.joint1 = this;
      }
      if (wall.joint2 === other) {
        wall.joint2 = this;
      }
    });

    this._wallIDs = this._wallIDs.concat(other._wallIDs);
    other.RemoveSelf();

    // special case: this and other has a common wall.
    this.walls.forEach(wall => {
      if (wall.joint1 === wall.joint2) {
        wall.RemoveSelf();
      }
    });
  }

  IsOnwall(wall: Wall): boolean {
    const segment = wall.segment;
    if (!segment) return false;
    const distance = this.position.distanceTo(segment)[0];
    return distance < 0.1;
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
    this.walls.forEach(wall => {
      wall.OnJointMove();
    });
  }

  private UpdateViewByPosition() {
    this.view.set({
      left: this.position.x,
      top: this.position.y,
    });
  }
}
