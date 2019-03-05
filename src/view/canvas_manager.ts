import {fabric} from 'fabric';

import {RenderOrderConfig} from '../config/render_order_config';
import {GetImage} from '../image_manager';
import {Point} from '../utils/index';

import {ViewObject} from './canvas_components/view_object';
import {ViewFactory} from './view_factory';


export class CanvasManager {
  private static canvas: fabric.Canvas;
  private static renderOrderMap = new Map<fabric.Object, number>();

  private constructor() {}

  static get width() {
    return this.canvas.getWidth();
  }
  static get height() {
    return this.canvas.getHeight();
  }

  static Init(id: string): void {
    this.canvas = new fabric.Canvas(id);
    const canvas = this.canvas;
    canvas.selection = false;

    this.AddGrid();
    this.EnableZoom();
    this.EnableDrag();
  }

  static Render(): void {
    this.canvas.requestRenderAll();
  }

  static OnMouseDown(callback: (p: Point) => void): void {
    const canvas = this.canvas;
    canvas.on('mouse:down', (event) => {
      const pos = canvas.getPointer(event.e);
      callback(new Point(pos.x, pos.y));
    });
  }

  static OnObjectMove(callback: (e: fabric.IEvent) => void): void {
    this.canvas.on('object:moving', callback);
  }

  static OnMouseMove(callback: (p: Point) => void): void {
    const canvas = this.canvas;
    canvas.on('mouse:move', (event) => {
      const pos = canvas.getPointer(event.e);
      callback(new Point(pos.x, pos.y));
    });
  }

  static OnObjectSelect(callback: (p: ViewObject) => void): void {
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

  static OnSelectClear(callback: () => void): void {
    const canvas = this.canvas;
    canvas.on('selection:cleared', (event) => {
      console.debug('fabric: selection:cleared');
      callback();
    });
  }

  static Add(obj: fabric.Object, renderOrder: number): void {
    this.canvas.add(obj);
    this.renderOrderMap.set(obj, renderOrder);
    this.SortViewObjects();
  }

  static Remove(obj: fabric.Object): void {
    this.canvas.remove(obj);
    this.renderOrderMap.delete(obj);
  }

  static SetAllSelectable(selectable: boolean) {
    const objs = this.canvas.getObjects();
    objs.forEach(obj => {
      obj.selectable = selectable;
    });
  }

  static ToSVG(): string {
    const svg = this.canvas.toSVG(null);
    return svg;
  }

  private static SortViewObjects() {
    this.canvas._objects.sort((a, b) => {
      const orderA = this.renderOrderMap.get(a);
      const orderB = this.renderOrderMap.get(b);
      return orderA - orderB;
    });
    this.canvas.requestRenderAll();
  }

  private static AddGrid() {
    const img = GetImage('grid');
    const obj = new fabric.Image(img, {
      originX: 'center',
      originY: 'center',
      left: this.canvas.getWidth() / 2,
      top: this.canvas.getHeight() / 2,
      evented: false,
    });
    this.Add(obj, RenderOrderConfig.GRID);
  }

  private static EnableZoom() {
    const canvas = this.canvas;
    canvas.on('mouse:wheel', opt => {
      const optWheel = opt.e as WheelEvent;
      const delta = optWheel.deltaY;
      let zoom = canvas.getZoom();
      zoom = zoom - delta / 200;
      if (zoom > 1.5) zoom = 1.5;
      if (zoom < 0.2) zoom = 0.2;
      canvas.zoomToPoint(
          new fabric.Point(optWheel.offsetX, optWheel.offsetY), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }

  private static EnableDrag() {
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
      const e = opt.e as MouseEvent;
      this.isDragging = false;
      // Fabric.js has a bug, after drag the canvas, we can't select object.
      // The haven't been solved until now:
      // https://github.com/fabricjs/fabric.js/issues/4660 I found a tricky
      // method to solve this problem. Maybe one day it will be solved
      // officially.
      canvas.zoomToPoint(
          new fabric.Point(e.clientX, e.clientY), canvas.getZoom());
    });
  }
}
