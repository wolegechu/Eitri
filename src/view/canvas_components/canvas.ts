import {fabric} from 'fabric';

import {Point} from '../../utils/index';

import {Accessory} from './accessory';
import {Background} from './background';
import {Joint} from './joint';
import {Room} from './room';
import * as ViewFactory from './view_factory';
import {ViewObject} from './view_object';
import {Wall} from './wall';

enum ViewPriority {
  BACKGROUND = 0,
  ROOM,
  WALL,
  JOINT,
  ACCESSORY
}


// Singleton
export class ViewCanvas {
  canvas: fabric.Canvas;

  private static instance = new ViewCanvas();
  private constructor() {}

  static GetInstance(): ViewCanvas {
    return ViewCanvas.instance;
  }

  Init(id: string): void {
    this.canvas = new fabric.Canvas(id);
    const canvas = this.canvas;
    canvas.selection = false;

    this.EnableZoom();
    this.EnableDrag();
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

  OnSelectClear(callback: () => void): void {
    const canvas = this.canvas;
    canvas.on('selection:cleared', (event) => {
      console.debug('fabric: selection:cleared');
      callback();
    });
  }

  Add(obj: ViewObject): void {
    this.canvas.add(obj.view);
    this.SortViewObjects();
  }

  Remove(obj: ViewObject): void {
    this.canvas.remove(obj.view);
  }

  SetAllSelectable(selectable: boolean) {
    const objs = this.canvas.getObjects();
    objs.forEach(obj => {
      obj.selectable = selectable;
    });
  }

  ToSVG(): string {
    const svg = this.canvas.toSVG(null);
    return svg;
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
      return ViewPriority.BACKGROUND;
    } else if (obj instanceof Room) {
      return ViewPriority.ROOM;
    } else if (obj instanceof Wall) {
      return ViewPriority.WALL;
    } else if (obj instanceof Joint) {
      return ViewPriority.JOINT;
    } else if (obj instanceof Accessory) {
      return ViewPriority.ACCESSORY;
    } else {
      console.assert(true, 'don\'t have this type');
    }
  }

  private EnableZoom() {
    const canvas = this.canvas;
    canvas.on('mouse:wheel', opt => {
      const optWheel = opt.e as WheelEvent;
      const delta = optWheel.deltaY;
      let zoom = canvas.getZoom();
      zoom = zoom - delta / 200;
      if (zoom > 2) zoom = 2;
      if (zoom < 0.05) zoom = 0.1;
      canvas.zoomToPoint(
          new fabric.Point(optWheel.offsetX, optWheel.offsetY), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }

  private EnableDrag() {
    const canvas = this.canvas;
    canvas.on('mouse:down', function(opt) {
      const evt = opt.e as MouseEvent;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    canvas.on('mouse:move', function(opt) {
      if (this.isDragging) {
        const e = opt.e as MouseEvent;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    canvas.on('mouse:up', function(opt) {
      this.isDragging = false;
    });
  }
}