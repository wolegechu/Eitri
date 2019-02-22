import {fabric} from 'fabric';

import {RenderOrderConfig} from '../../config/render_order_config';
import {ObjectOptions, ViewObject} from './view_object';

interface PedestalOption extends ObjectOptions {
  foundation?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  flip?: boolean;
}

/**
 * 底座！！
 */
export class Pedestal extends ViewObject {
  static typeName = 'pedestal';
  get typeName() {
    return Pedestal.typeName;
  }
  get renderOrder() {
    return RenderOrderConfig.PEDESTAL;
  }

  foundation = 'default';
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  rotation = 0;
  flip = false;

  view: fabric.Group;  // rectangle + image

  constructor(id: number, option: PedestalOption) {
    super(id);

    // image

    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: this.width,
      height: this.height,
      evented: false
    });
    this.view = new fabric.Group([rect], {
      left: this.x,
      top: this.y,
      evented: false,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    this.Set(option);
  }

  UpdateView(): void {
    throw new Error('Method not implemented.');
  }

  protected Set(option: PedestalOption): void {
    if (option.flip !== undefined) {
      this.flip = option.flip;
    }
    if (option.foundation !== undefined) {
      this.foundation = option.foundation;
    }
    if (option.height !== undefined) {
      this.height = option.height;
    }
    if (option.rotation !== undefined) {
      this.rotation = option.rotation;
    }
    if (option.width !== undefined) {
      this.width = option.width;
    }
    if (option.x !== undefined) {
      this.x = option.x;
    }
    if (option.y !== undefined) {
      this.y = option.y;
    }
  }
}
