import {fabric} from 'fabric';

import {GetImage} from '../../ImageManager';
import {Point} from '../../utils/index';

import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';
import {FurnitureExportedProperties, ObjectOptions, ViewObject} from './view_object';

type FurnitureParameter = {
  imgHandle: string; x: string; y: string; w: string; h: string; r: number;
  p: boolean;
};

export interface FurnitureGroupOption extends ObjectOptions {
  position: {x: number, y: number};
  rotation: number;
  aWidth: number;   // a
  bHeight: number;  // b
  flip: boolean;
  furnitures: FurnitureParameter[];
}

/**
 * A group of furnitures, used to fill in the pedestal.
 */
export class FurnitureGroup extends ViewObject {
  static typeName = 'group';
  get typeName() {
    return FurnitureGroup.typeName;
  }

  private position: Point = new Point(0, 0);
  private rotation = 0;
  private aWidth = 100;   // a
  private bHeight = 100;  // b
  private flip = false;
  private furnitures: FurnitureParameter[];

  view: fabric.Group;

  constructor(id: number, option: FurnitureGroupOption) {
    super(id);

    // add a rectangle first to make the origin top left
    const rect = new fabric.Rect({
      height: 0,
      width: 0,
      stroke: '#FF0000',
      fill: '#00000000',
    });
    this.view = new fabric.Group([rect], {
      left: this.position.x,
      top: this.position.y,
      angle: this.rotation,
      flipX: this.flip,
      evented: false,
    });

    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;
    this.Set(option);
  }

  ToJson(): ObjectOptions {
    return Object.assign({}, this, {view: undefined});
  }

  ExportProperties(): FurnitureExportedProperties {
    const properties: FurnitureExportedProperties = {};
    return properties;
  }

  ImportProperties(props: FurnitureExportedProperties): void {
    throw new Error('Method not implemented.');
  }

  UpdateView(): void {
    this.NewFabricGroup();
  }


  protected Set(option: FurnitureGroupOption): void {
    if (option.bHeight !== undefined) {
      this.bHeight = option.bHeight;
    }
    if (option.aWidth !== undefined) {
      this.aWidth = option.aWidth;
    }
    if (option.flip !== undefined) {
      this.flip = option.flip;
    }
    if (option.furnitures !== undefined) {
      this.furnitures = option.furnitures;
    }
    if (option.position !== undefined) {
      this.position = new Point(option.position.x, option.position.y);
    }
    if (option.rotation !== undefined) {
      this.rotation = option.rotation;
    }
    this.UpdateView();
  }

  private NewFabricGroup() {
    // when change 'view', factory should be reseted.
    ViewFactory.RemoveObject(this);

    // the border of the room
    const rect = new fabric.Rect({
      height: this.bHeight,
      width: this.aWidth,
      stroke: '#FF0000',
      fill: '#00000000',
    });

    const objs: fabric.Object[] = [rect];
    this.furnitures.forEach(params => {
      console.log('furniture');
      const img = GetImage(params.imgHandle);

      const a = this.aWidth;
      const b = this.bHeight;
      const w = eval(params.w);
      const h = eval(params.h);

      const obj = new fabric.Image(img, {
        left: eval(params.x),
        top: eval(params.y),
        angle: params.r,
        scaleX: eval(params.w) / img.width,
        scaleY: eval(params.h) / img.height,
        evented: false,
        flipX: params.p,
      });
      obj.hasControls = obj.hasBorders = false;
      obj.perPixelTargetFind = true;
      objs.push(obj);
    });

    this.view = new fabric.Group(objs, {
      left: this.position.x,
      top: this.position.y,
      angle: this.rotation,
      flipX: this.flip,
      evented: false,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    ViewFactory.AddObject(this);
  }
}
