import {fabric} from 'fabric';

import {ViewCanvas} from './canvas';
import {ExportedProperties, ViewObject} from './view_object';


/**
 * The background image.
 */
export class Background extends ViewObject {
  constructor(id: number, htmlImage: HTMLImageElement) {
    super(id);

    const viewCanvas = ViewCanvas.GetInstance();
    const scale = Math.min(
        viewCanvas.canvas.getWidth() / htmlImage.width,
        viewCanvas.canvas.getHeight() / htmlImage.height,
    );
    this.view = new fabric.Image(htmlImage, {
      angle: 0,
      padding: 10,
      opacity: 0.3,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      hasBorders: false,
      scaleX: scale,
      scaleY: scale,
      evented: false
    });

    viewCanvas.canvas.centerObject(this.view);
  }

  ExportProperties(): ExportedProperties {
    const properties: ExportedProperties = {id: this.id};
    return properties;
  }
}
