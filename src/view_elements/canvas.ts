import {fabric} from 'fabric';
import {Point} from '../utils/index';


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
      callback(pos);
    });
  }

  OnObjectMove(callback: (e: fabric.IEvent) => void): void {
    this.canvas.on('object:moving', callback);
  }

  OnMouseMove(callback: (p: Point) => void): void {
    const canvas = this.canvas;
    canvas.on('mouse:move', (event) => {
      const pos = canvas.getPointer(event.e);
      callback(pos);
    });
  }

  Add(obj: fabric.Object): void {
    this.canvas.add(obj);
    // this.canvas._objects.sort((a, b) => {
    //   if (a instanceof fabric.Line) return -1;
    //   return 1;
    // });
    // this.canvas.renderAll();
    // const objs = this.canvas._objects;
    // if (obj instanceof fabric.Line) {
    //   objs.splice(0, 0, obj);
    // }
    // else {
    //   objs.push(obj);
    // }

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
