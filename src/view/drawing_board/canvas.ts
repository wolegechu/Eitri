import {fabric} from 'fabric';

import {Point} from '../../utils/index';

import {Accessory} from './accessory';
import {Background} from './background';
import {Joint} from './joint';
import {Room} from './room';
import * as ViewFactory from './view_factory';
import {ViewObject} from './view_object';
import {Wall} from './wall';

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
    canvas.on('selection:updated', (event) => {
      console.debug('fabric: selection:updated');
      const obj = ViewFactory.GetViewObjectWithView(event.target);
      callback(obj);
    });

    canvas.on('selection:created', (event) => {
      console.debug('fabric: selection:created');
      const obj = ViewFactory.GetViewObjectWithView(event.target);
      callback(obj);
    });
  }

  Add(obj: ViewObject): void {
    this.canvas.add(obj.view);
    this.SortViewObjects();
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

  private SortViewObjects() {
    this.canvas._objects.sort((a, b) => {
      return this.GetSortPriority(a) - this.GetSortPriority(b);
    });
    this.canvas.requestRenderAll();
  }

  private GetSortPriority(view: fabric.Object): number {
    const obj = ViewFactory.GetViewObjectWithView(view);
    if (obj instanceof Background) {
      return 0;
    } else if (obj instanceof Room) {
      return 5;
    } else if (obj instanceof Wall) {
      return 10;
    } else if (obj instanceof Joint) {
      return 15;
    } else if (obj instanceof Accessory) {
      return 20;
    } else {
      console.assert(true, 'don\'t have this type');
    }
  }
}
