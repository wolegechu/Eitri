import {fabric} from 'fabric';

import {Point} from '../../utils/index';

import {ViewCanvas} from './canvas';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {AccessoryExportedProperties, ExportedProperties, ViewObject} from './view_object';
import {Wall} from './wall';


/**
 * Represent things depend on Wall. Such as Window, Door.
 */
export class Accessory extends ViewObject {
  wallID: number;
  length: number;  // the length of the accessory
  position: Point;
  positionPercent: number;
  view: fabric.Image;

  constructor(id: number, pos: Point, img: HTMLImageElement, length = 100) {
    super(id);

    this.length = length;

    // this.position = pos;
    this.view = new fabric.Image(img, {
      originX: 'center',
      originY: 'center',
      left: pos.x,
      top: pos.y,
      scaleX: 0.3,
      scaleY: this.length / img.height,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    const canvas = ViewCanvas.GetInstance();
    canvas.OnObjectMove((e) => this.OnObjectMove(e));
  }

  ExportProperties(): AccessoryExportedProperties {
    const properties: AccessoryExportedProperties = {wallID: this.wallID};
    return properties;
  }

  ImportProperties(props: ExportedProperties): void {
    throw new Error('Method not implemented.');
  }

  SetPositionAndWall(point: Point, wall: Wall = null) {
    this.position = point;

    // remove the old wall
    if (this.wallID) {
      const oldWall = ViewFactory.GetViewObject(this.wallID) as Wall;
      oldWall.RemoveAccessoryID(this.id);
    }

    // add the new wall
    if (wall) {
      this.wallID = wall.id;
      wall.AddAccessoryID(this.id);
    }

    this.PositionUpdatePercent();
    this.UpdateViewPosition();
    this.UpdateViewRotation();
  }

  OnWallMove() {
    this.PercentUpdatePosition();
    this.UpdateViewPosition();
    this.UpdateViewRotation();
  }

  /**
   * use the absolute position to update the position relative to the wall.
   */
  private PositionUpdatePercent(): number {
    if (!this.wallID) return;
    const wall = ViewFactory.GetViewObject(this.wallID) as Wall;
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
    if (!this.wallID) return;
    const wall = ViewFactory.GetViewObject(this.wallID) as Wall;
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

    this.UpdateViewPosition();
  }

  private OnObjectMove(e: fabric.IEvent) {
    if (e.target !== this.view) return;
    console.debug('On Joint Move');
    this.UpdatePosition();
  }

  // Update the Position property based on this.view
  private UpdatePosition() {
    this.position.x = this.view.left;
    this.position.y = this.view.top;
  }

  private UpdateViewPosition() {
    this.view.set({
      left: this.position.x,
      top: this.position.y,
    });
    this.view.setCoords();
    ViewCanvas.GetInstance().Render();
  }

  private UpdateViewRotation() {
    if (!this.wallID) return;
    const wall = ViewFactory.GetViewObject(this.wallID) as Wall;
    const joint1 = ViewFactory.GetViewObject(wall.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(wall.jointIDs[1]) as Joint;

    const aPoint = joint1.position.clone();
    const bPoint = joint2.position.clone();
    const vec = bPoint.clone().subtract(aPoint);
    this.view.set({angle: (Math.atan2(vec.y, vec.x) / Math.PI * 180 - 90)});
    this.view.setCoords();
    ViewCanvas.GetInstance().Render();
  }
}
