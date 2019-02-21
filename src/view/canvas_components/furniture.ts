import {fabric} from 'fabric';

import {GetImage} from '../../ImageManager';
import {Point} from '../../utils/index';

import {ViewCanvas} from './canvas';
import {FurnitureExportedProperties, ObjectOptions, ViewObject} from './view_object';


interface FurnitureOption extends ObjectOptions {
  imgHandle?: string;
  position?: {x: number, y: number};
  rotation?: number;
  width?: number;
  height?: number;
  flip?: boolean;
}


export class Furniture extends ViewObject {
  static typeName = 'furniture';
  get typeName() {
    return Furniture.typeName;
  }

  private imgHandle = 'bed';
  private position: Point = new Point(0, 0);
  private rotation = 0;
  private width = 100;
  private height = 100;
  private flip = false;

  view: fabric.Image;

  constructor(id: number, option: FurnitureOption) {
    super(id);

    const img = GetImage(this.imgHandle);
    this.view = new fabric.Image(img, {
      left: this.position.x,
      top: this.position.y,
      angle: this.rotation,
      scaleX: this.width / img.width,
      scaleY: this.height / img.height,
      lockMovementX: true,
      lockMovementY: true,
      evented: false,
      flipX: this.flip
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    this.Set(option);
  }

  ToJson(): ObjectOptions {
    return Object.assign({}, this, {view: undefined});
  }

  UpdateView(): void {
    this.view.set({
      left: this.position.x,
      top: this.position.y,
      angle: this.rotation,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      flipX: this.flip
    });

    this.UpdateViewByImage();
    this.view.setCoords();
    ViewCanvas.GetInstance().Render();
  }

  protected Set(option: FurnitureOption): void {
    if (option.flip !== undefined) {
      this.flip = option.flip;
    }
    if (option.height !== undefined) {
      this.height = option.height;
    }
    if (option.width !== undefined) {
      this.width = option.width;
    }
    if (option.imgHandle !== undefined) {
      this.imgHandle = option.imgHandle;
    }
    if (option.position !== undefined) {
      this.position = new Point(option.position.x, option.position.y);
    }
    if (option.rotation !== undefined) {
      this.rotation = option.rotation;
    }
    this.UpdateView();
  }

  private UpdateViewByImage() {
    const img = GetImage(this.imgHandle);
    this.view.setSrc(img.src);
    this.view.set({
      scaleX: this.width / img.width,
      scaleY: this.height / this.view.height,
    });
  }
}
