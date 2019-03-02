import {fabric} from 'fabric';

import {RenderOrderConfig} from '../../config/render_order_config';

import {CanvasManager} from './canvas_manager';
import {ObjectOptions, ViewObject} from './view_object';


interface BackgroundOptions extends ObjectOptions {
  htmlImage: HTMLImageElement;
}

/**
 * The background image.
 */
export class Background extends ViewObject {
  static typeName = 'background';
  get typeName() {
    return Background.typeName;
  }
  get renderOrder() {
    return RenderOrderConfig.BACKGROUND;
  }

  private _scale: number;
  get scale() {
    return this._scale;
  }

  constructor(id: number, option: BackgroundOptions) {
    super(id);

    const htmlImage = option.htmlImage;

    this._scale = Math.min(
        CanvasManager.width / htmlImage.width,
        CanvasManager.height / htmlImage.height,
    );
    this.view = new fabric.Image(htmlImage, {
      angle: 0,
      left: 0,
      top: 0,
      padding: 10,
      opacity: 0.5,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      hasBorders: false,
      scaleX: this._scale,
      scaleY: this._scale,
      evented: false,
    });
  }

  UpdateView(): void {
    this.view.set({
      scaleX: this._scale,
      scaleY: this._scale,
    });
    this.view.setCoords();
    CanvasManager.Render();
  }

  SetScale(scale: number): void {
    this._scale = scale;
    this.UpdateView();
  }

  protected Set(option: ObjectOptions): void {
    throw new Error('Method not implemented.');
  }
}
