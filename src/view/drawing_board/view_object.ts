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

export class FurnitureExportedProperties extends ExportedProperties {
  
}

export class RoomExportedProperties extends ExportedProperties {
  type: OptionProperty;
}

export interface ObjectOptions {}

export abstract class ViewObject {
  abstract get typeName(): string;

  id: number;
  view: fabric.Object;

  // ------ used on selectable object ------
  // exposure properties. It's usually used by the UIView.
  ExportProperties?(): ExportedProperties;
  ImportProperties?(props: ExportedProperties): void;
  OnSelect?(): void;
  OnUnSelect?(): void;
  // ---------------------------------------

  ToJson?(): ObjectOptions;
  protected abstract Set(option: ObjectOptions): void;
  abstract UpdateView(): void;

  constructor(id: number) {
    this.id = id;
  }

  RemoveSelf() {
    ViewFactory.RemoveObject(this);
  }
}