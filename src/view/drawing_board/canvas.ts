import {fabric} from 'fabric';
import {Point} from '../../utils/index';

import * as ViewFactory from './view_factory';
import {ViewObject} from './view_object';

// Singleton
export class ViewCanvas {
  canvas: fabric.Canvas;

  private static instance = new ViewCanvas();
  private constructor() {
    this.canvas = new fabric.Canvas('c');
    this.canvas.selection = false;
  }

  static GetInstance(): ViewCanvas {
    return ViewCanvas.instance;
  }

  Render(): void {
    this.canvas.requestRenderAll();
  }

  OnMouseDown(callback: (p: Point) => void): void {
    const canvas = this.canvas;
    canvas.on('mouse:down', (event) => {
      const pos = canvas.getPointer(event.e);
      callback(new Point(pos.x, pos.y));
    });
  }

  OnObjectMove(callback: (e: fabric.IEvent) => void): void {
    this.canvas.on('object:moving', callback);
  }

  OnMouseMove(callback: (p: Point) => void): void {
    const canvas = this.canvas;
    canvas.on('mouse:move', (event) => {
      const pos = canvas.getPointer(event.e);
      callback(new Point(pos.x, pos.y));
    });
  }

  OnObjectSelect(callback: (p: ViewObject) => void): void {
    const canvas = this.canvas;
    canvas.on('selection:created', (event) => {
      const obj = ViewFactory.GetObjectByFabric(event.target);
      callback(obj);
    });
  }

  AddImage(htmlImage: HTMLImageElement): void {
    const canvas = this.canvas;
    const scale = Math.min(
        canvas.getWidth() / htmlImage.width,
        canvas.getHeight() / htmlImage.height,
    );
    const image = new fabric.Image(htmlImage, {
      angle: 0,
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

    canvas.centerObject(image);
    canvas.add(image);
    canvas.renderAll();
  }

  Add(obj: fabric.Object): void {
    this.canvas.add(obj);
    this.canvas._objects.sort((a, b) => {
      if (a instanceof fabric.Line) return -1;
      return 1;
    });
    this.canvas.requestRenderAll();
  }

  Remove(obj: fabric.Object): void {
    this.canvas.remove(obj);
  }

  SetAllSelectable(selectable: boolean) {
    const objs = this.canvas.getObjects();
    objs.forEach(obj => {
      obj.selectable = selectable;
    });
  }
}
