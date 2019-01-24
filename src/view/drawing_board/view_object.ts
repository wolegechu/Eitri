import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';

export const PROPERTY_TYPE_NUMBER = 'number';
export const PROPERTY_TYPE_OPTION = 'option';

export interface ViewProperty {
  // tslint:disable-next-line:no-any
  value: any;
  type: string;
}

export interface OptionProperty extends ViewProperty {
  // tslint:disable-next-line:no-any
  options: string[];
}

export class ExportedProperties {}

export class WallExportedProperties extends ExportedProperties {
  // id: number;
  length: ViewProperty;
  type: OptionProperty;
}

export class JointExportedProperties extends ExportedProperties {
  x: number;
  y: number;
}

export class AccessoryExportedProperties extends ExportedProperties {
  wallID: number;
}

export class RoomExportedProperties extends ExportedProperties {
  type: OptionProperty;
}

export interface ObjectOptions {}

export abstract class ViewObject {
  static typeName: string;

  id: number;
  view: fabric.Object;

  // exposure properties. It's usually used by the UIView.
  abstract ExportProperties(): ExportedProperties;
  abstract ImportProperties(props: ExportedProperties): void;
  abstract ToJson(): ObjectOptions;
  protected abstract Set(option: ObjectOptions): void;
  abstract UpdateView(): void;

  constructor(id: number) {
    this.id = id;
  }

  RemoveSelf() {
    ViewCanvas.GetInstance().Remove(this);
    ViewFactory.RemoveObject(this);
  }
}