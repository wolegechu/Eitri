import {Point} from '../../../utils';
import {ViewObject} from '../view_object';

export class CanvasManager {
  static get width() {
    return 500;
  }
  static get height() {
    return 500;
  }

  static Init(id: string): void {}

  static Render(): void {}

  static OnMouseDown(callback: (p: Point) => void): void {}

  static OnObjectMove(callback: (e: fabric.IEvent) => void): void {}

  static OnMouseMove(callback: (p: Point) => void): void {}

  static OnObjectSelect(callback: (p: ViewObject) => void): void {}

  static OnSelectClear(callback: () => void): void {}

  static Add(obj: fabric.Object, renderOrder: number): void {}

  static Remove(obj: fabric.Object): void {}

  static SetAllSelectable(selectable: boolean) {}

  static ToSVG(): string {
    return 'svg';
  }
}
