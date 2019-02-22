import {fabric} from 'fabric';

import {CanvasManager} from './canvas_manager';
import {RenderOrderConfig} from '../../config/render_order_config';
import {ExportedProperties, ObjectOptions, ViewObject} from './view_object';


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

  constructor(id: number, htmlImage: HTMLImageElement) {
    super(id);

    const scale = Math.min(
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
      scaleX: scale,
      scaleY: scale,
      evented: false
    });
  }

  UpdateView(): void {
    throw new Error('Method not implemented.');
  }

  protected Set(option: ObjectOptions): void {
    throw new Error('Method not implemented.');
  }
}
