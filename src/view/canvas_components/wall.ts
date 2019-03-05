import {fabric} from 'fabric';
import Flatten from 'flatten-js';

import {RenderOrderConfig} from '../../config/render_order_config';
import {CanvasManager} from '../canvas_manager';
import {ViewFactory} from '../view_factory';

import {Accessory} from './accessory';
import {Joint} from './joint';
import {ObjectOptions, PROPERTY_TYPE_NUMBER, PROPERTY_TYPE_OPTION, ViewObject, WallExportedProperties} from './view_object';

const UNSELECTED_COLOR = '#808080';

export enum WallType {
  NORMAL = '普通墙',
  MAIN = '承重墙'
}


interface WallOption extends ObjectOptions {
  _jointIDs?: number[];
  accessoryIDs?: number[];
  width?: number;
  type?: string;
}


export class Wall extends ViewObject {
  static typeName = 'wall';
  get typeName() {
    return Wall.typeName;
  }
  get renderOrder() {
    return RenderOrderConfig.WALL;
  }

  private _jointIDs: number[] = [];
  private accessoryIDs: number[] = [];
  private width = 19;
  private type: string = WallType.NORMAL;

  get joint1(): Joint {
    return ViewFactory.GetViewObject(this._jointIDs[0]) as Joint;
  }
  set joint1(newJoint: Joint) {
    this._jointIDs[0] = newJoint.id;
  }
  get joint2(): Joint {
    return ViewFactory.GetViewObject(this._jointIDs[1]) as Joint;
  }
  set joint2(newJoint: Joint) {
    this._jointIDs[1] = newJoint.id;
  }
  get segment(): Flatten.Segment {
    if (this._jointIDs.length !== 2 || !this.joint1 || !this.joint2) {
      return undefined;
    }

    return new Flatten.Segment(this.joint1.position, this.joint2.position);
  }

  view: fabric.Line;

  get length(): number {
    const p1 = this.joint1.position;
    const p2 = this.joint2.position;
    return p1.distanceTo(p2)[0];
  }

  constructor(id: number, option: WallOption) {
    super(id);

    this.view = new fabric.Line([0, 0, 0, 0], {
      originX: 'center',
      originY: 'center',
      strokeWidth: this.width,
      stroke: UNSELECTED_COLOR,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    this.Set(option);
  }

  ExportProperties(): WallExportedProperties {
    const properties = new WallExportedProperties();
    properties.length = {value: this.length, type: PROPERTY_TYPE_NUMBER};
    properties.type = {
      value: this.type,
      type: PROPERTY_TYPE_OPTION,
      options: [WallType.MAIN, WallType.NORMAL]
    };
    return properties;
  }

  ImportProperties(props: WallExportedProperties) {
    // this.length = props.length.value;
    this.type = props.type.value;
  }

  ToJson(): ObjectOptions {
    return Object.assign({}, this, {view: undefined});
  }

  OnSelect(): void {
    this.view.set({stroke: '#A0A0A0'});
  }

  OnUnSelect(): void {
    this.view.set({
      stroke: UNSELECTED_COLOR,
    });
  }

  UpdateView(): void {
    this.UpdateViewByJoint();
    this.UpdateViewByWidth();

    this.view.setCoords();
    CanvasManager.Render();
  }

  /**
   * Split the wall to two walls through a joint between two ends of the wall.
   */
  Split(cutJoint: Joint) {
    ViewFactory.CreateWall(cutJoint, this.joint1);
    ViewFactory.CreateWall(cutJoint, this.joint2);
    this.RemoveSelf();
  }

  Merge(other: Wall) {
    // make a copy, prevent from resouece competition.
    const accessoryIds = other.accessoryIDs.map(e => e);
    accessoryIds.forEach(id => {
      const obj = ViewFactory.GetViewObject(id) as Accessory;
      obj.SetWallID(this.id);
    });
    other.RemoveSelf();
  }

  OnJointMove(): void {
    this.accessoryIDs.forEach(id => {
      const obj = ViewFactory.GetViewObject(id) as Accessory;
      if (obj) obj.OnWallMove();
    });

    this.UpdateView();
  }

  RemoveSelf() {
    super.RemoveSelf();
    if (this.joint1) {
      this.joint1.RemoveWallID(this.id);
    }
    if (this.joint2) {
      this.joint2.RemoveWallID(this.id);
    }
  }

  AddAccessoryID(id: number) {
    const index = this.accessoryIDs.indexOf(id);
    if (index === -1) this.accessoryIDs.push(id);
  }

  RemoveAccessoryID(id: number) {
    const index = this.accessoryIDs.indexOf(id);
    if (index !== -1) this.accessoryIDs.splice(index, 1);
  }

  IsDuplicateTo(b: Wall): boolean {
    const a = this;
    if (a.joint1 === b.joint1 && a.joint2 === b.joint2) {
      return true;
    }
    if (a.joint1 === b.joint2 && a.joint2 === b.joint1) {
      return true;
    }

    return false;
  }

  protected Set(option: WallOption): void {
    if (option._jointIDs !== undefined) {
      this._jointIDs = option._jointIDs;
      this._jointIDs.forEach(id => {
        const joint = ViewFactory.GetViewObject(id) as Joint;
        if (joint) joint.AddWallID(this.id);
      });
    }
    if (option.accessoryIDs !== undefined) {
      this.accessoryIDs = option.accessoryIDs;
    }
    if (option.type !== undefined) {
      this.type = option.type;
    }
    if (option.width !== undefined) {
      this.width = option.width;
    }
    this.UpdateView();
  }

  private UpdateViewByJoint() {
    if (2 !== this._jointIDs.length) return;
    const joint1 = this.joint1;
    const joint2 = this.joint2;
    if (!joint1 || !joint2) return;

    this.view.set({
      'x1': joint1.position.x,
      'y1': joint1.position.y,
      'x2': joint2.position.x,
      'y2': joint2.position.y,
    });
  }

  private UpdateViewByWidth() {
    this.view.set({
      strokeWidth: this.width,
    });
  }
}