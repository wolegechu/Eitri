import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';

export const PROPERTY_TYPE_NUMBER = 'number';
export const PROPERTY_TYPE_OPTION = 'option';

export interface ViewProperty {
  // tslint:disable-next-line:no-any
  value: any;
  type: string;
}

export interface OptionProperty extends ViewProperty{
  // tslint:disable-next-line:no-any
  options: string[];
}

export class ExportedProperties {}

export interface WallExportedProperties extends ExportedProperties {
  // id: number;
  width: ViewProperty;
  type: OptionProperty;
}

export interface JointExportedProperties extends ExportedProperties {
  x: number;
  y: number;
}

export interface AccessoryExportedProperties extends ExportedProperties {
  wallID: number;
}

export interface RoomExportedProperties extends ExportedProperties {
  type: OptionProperty;
}

export abstract class ViewObject {
  id: number;
  view: fabric.Object;

  // exposure properties. It's usually used by the UIView.
  abstract ExportProperties(): ExportedProperties;
  abstract ImportProperties(props: ExportedProperties): void;

  constructor(id: number) {
    this.id = id;
  }

  RemoveSelf() {
    ViewCanvas.GetInstance().Remove(this.view);
    ViewFactory.RemoveObject(this);
  }
}