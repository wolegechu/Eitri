import {fabric} from 'fabric';

import {GetImage} from '../../image_manager';
import {Point} from '../../utils/index';

import {CanvasManager} from './canvas_manager';
import {Joint} from './joint';
import {RenderOrderConfig} from '../../config/render_order_config';
import * as ViewFactory from './view_factory';
import {AccessoryExportedProperties, ExportedProperties, ObjectOptions, ViewObject} from './view_object';
import {Wall} from './wall';


interface AccessoryOption extends ObjectOptions {
  wallID?: number;
  imgHandle?: string;
  length?: number;
  position?: {x: number, y: number};
  positionPercent?: number;
}

/**
 * Represent things depend on Wall. Such as Window, Door.
 */
export class Accessory extends ViewObject {
  static typeName = 'accessory';
  get typeName() {
    return Accessory.typeName;
  }
  get renderOrder() {
    return RenderOrderConfig.ACCESSORY;
  }

  private wallID = -1;
  private imgHandle = 'door';
  private length = 100;  // the length of the accessory
  private position = new Point(0, 0);
  private positionPercent = 0;

  view: fabric.Image;

  constructor(id: number, option: AccessoryOption) {
    super(id);

    const img = GetImage(this.imgHandle);
    this.view = new fabric.Image(img, {
      originX: 'center',
      originY: 'center',
      left: this.position.x,
      top: this.position.y,
      scaleX: 0.3,
      scaleY: this.length / img.height,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    this.Set(option);
  }

  ToJson(): ObjectOptions {
    return Object.assign({}, this, {view: undefined});
  }

  ExportProperties(): AccessoryExportedProperties {
    const properties: AccessoryExportedProperties = {wallID: this.wallID};
    return properties;
  }

  ImportProperties(props: ExportedProperties): void {
    throw new Error('Method not implemented.');
  }

  OnSelect(): void {
    console.log(this.view.filters);
    this.view.filters.push(
        new fabric.Image.filters.Sepia(),
    );
    this.view.applyFilters(null);
  }

  OnUnSelect(): void {
    this.view.filters = [];
    this.view.applyFilters(null);
  }

  UpdateView() {
    this.UpdateViewByPosition();
    this.UpdateViewByWall();
    this.UpdateViewByImage();
    this.UpdateViewByLength();

    this.view.setCoords();
    CanvasManager.Render();
  }

  OnWallMove() {
    this.PercentUpdatePosition();
    this.UpdateView();
  }

  RemoveSelf() {
    super.RemoveSelf();
    const oldWall = ViewFactory.GetViewObject(this.wallID) as Wall;
    if (oldWall) oldWall.RemoveAccessoryID(this.id);
  }

  SetPosition(pos: Point) {
    this.position = pos;
    this.PositionUpdatePercent();
    this.UpdateView();
  }

  SetWallID(wallID: number) {
    // remove the old wall
    const oldWall = ViewFactory.GetViewObject(this.wallID) as Wall;
    if (oldWall) oldWall.RemoveAccessoryID(this.id);

    // add the new wall
    this.wallID = wallID;
    const newWall = ViewFactory.GetViewObject(this.wallID) as Wall;
    if (newWall) newWall.AddAccessoryID(this.id);

    this.UpdateView();
  }

  protected Set(option: AccessoryOption) {
    if (option.wallID !== undefined) {
      this.wallID = option.wallID;
    }
    if (option.length !== undefined) {
      this.length = option.length;
    }
    if (option.position !== undefined) {
      this.position = new Point(option.position.x, option.position.y);
    }
    if (option.positionPercent !== undefined) {
      this.positionPercent = option.positionPercent;
    }
    if (option.imgHandle !== undefined) {
      this.imgHandle = option.imgHandle;
    }

    this.UpdateView();
  }

  /**
   * use the absolute position to update the position relative to the wall.
   */
  private PositionUpdatePercent(): number {
    const wall = ViewFactory.GetViewObject(this.wallID) as Wall;
    if (!wall) return;
    const joint1 = ViewFactory.GetViewObject(wall.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(wall.jointIDs[1]) as Joint;

    const aPoint = joint1.position.clone();
    const bPoint = joint2.position.clone();
    const normVec = bPoint.clone().subtract(aPoint).norm();  // a->b
    aPoint.add(normVec.clone().multiplyScalar(this.length / 2));
    bPoint.subtract(normVec.clone().multiplyScalar(this.length / 2));

    const wallVec = bPoint.clone().subtract(aPoint);
    const windowVec = this.position.clone().subtract(aPoint);
    this.positionPercent = windowVec.clone().divide(wallVec).x;
    // special case: vertical wall
    if (!isFinite(this.positionPercent) || isNaN(this.positionPercent)) {
      this.positionPercent = windowVec.clone().divide(wallVec).y;
    }

    // the window is out of range, drag back the window
    if (this.positionPercent >= 1 || this.positionPercent < 0) {
      this.positionPercent = Math.max(0, this.positionPercent);
      this.positionPercent = Math.min(1, this.positionPercent);
      this.PercentUpdatePosition();
    }
    return this.positionPercent;
  }

  /**
   * use the position relative to the wall to update the absolute position.
   */
  private PercentUpdatePosition() {
    const wall = ViewFactory.GetViewObject(this.wallID) as Wall;
    if (!wall) return;
    const joint1 = ViewFactory.GetViewObject(wall.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(wall.jointIDs[1]) as Joint;

    const aPoint = joint1.position.clone();
    const bPoint = joint2.position.clone();
    const normVec = bPoint.clone().subtract(aPoint).norm();  // a->b
    aPoint.add(normVec.clone().multiplyScalar(this.length / 2));
    bPoint.subtract(normVec.clone().multiplyScalar(this.length / 2));

    const wallVec = bPoint.clone().subtract(aPoint);
    this.position = aPoint.clone().add(
        wallVec.clone().multiplyScalar(this.positionPercent));

    this.UpdateViewByPosition();
  }

  private UpdateViewByPosition() {
    this.view.set({
      left: this.position.x,
      top: this.position.y,
      scaleY: this.length / this.view.height,
    });
  }

  private UpdateViewByWall() {
    const wall = ViewFactory.GetViewObject(this.wallID) as Wall;
    if (!wall) return;
    const joint1 = ViewFactory.GetViewObject(wall.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(wall.jointIDs[1]) as Joint;

    const aPoint = joint1.position.clone();
    const bPoint = joint2.position.clone();
    const vec = bPoint.clone().subtract(aPoint);
    this.view.set({angle: (Math.atan2(vec.y, vec.x) / Math.PI * 180 - 90)});
  }

  private UpdateViewByImage() {
    const img = GetImage(this.imgHandle);
    this.view.setSrc(img.src);
    this.view.set({
      scaleY: this.length / this.view.height,
    });
  }

  private UpdateViewByLength() {
    this.view.set({
      scaleY: this.length / this.view.height,
    });
  }
}
