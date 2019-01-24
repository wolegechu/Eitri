import {fabric} from 'fabric';

import {ViewCanvas} from './canvas';
import {ExportedProperties, ObjectOptions, ViewObject} from './view_object';


/**
 * The background image.
 */
export class Background extends ViewObject {
  static typeName = 'background';

  constructor(id: number, htmlImage: HTMLImageElement) {
    super(id);

    const canvas = ViewCanvas.GetInstance().canvas;
    const scale = Math.min(
        canvas.getWidth() / htmlImage.width,
        canvas.getHeight() / htmlImage.height,
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

    canvas.centerObject(this.view);
    ViewCanvas.GetInstance().Add(this);
  }

  ExportProperties(): ExportedProperties {
    const properties: ExportedProperties = {id: this.id};
    return properties;
  }

  ImportProperties(props: ExportedProperties): void {
    throw new Error('Method not implemented.');
  }

  ToJson(): ObjectOptions {
    return {};
  }

  UpdateView(): void {
    throw new Error('Method not implemented.');
  }

  protected Set(option: ObjectOptions): void {
    throw new Error('Method not implemented.');
  }
}
