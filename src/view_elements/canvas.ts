import {fabric} from 'fabric';
import {Point} from '../utils/index';


// Singleton
export class ViewCanvas {
  canvas: fabric.Canvas;

  private static instance = new ViewCanvas();
  private constructor() {
    this.canvas = new fabric.Canvas('c');
  }

  static GetInstance(): ViewCanvas {
    return ViewCanvas.instance;
  }

  OnMouseDown(callback: (p: Point) => void): void {
    const canvas = this.canvas;
    canvas.on('mouse:down', (event) => {
      const pos = canvas.getPointer(event.e);
      callback(pos);
    });
  }

  OnObjectMove(callback: (e: fabric.IEvent) => void): void {
    this.canvas.on('object:moving', callback);
  }

  Add(obj: fabric.Object): void {
    this.canvas.add(obj);
  }
}
