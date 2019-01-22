import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';

export const PROPERTY_TYPE_NUMBER = "number";
export const PROPERTY_TYPE_WALL_TYPE = "wall_type";
export const PROPERTY_TYPE_ROOM_TYPE = "room_type";

export interface ViewProperty {
  // tslint:disable-next-line:no-any
  value: any;
  type: string;
}

export class ExportedProperties {

}

export interface WallExportedProperties extends ExportedProperties {
  // id: number;
  width: ViewProperty;
  type: ViewProperty;
}

export interface JointExportedProperties extends ExportedProperties {
  x: number;
  y: number;
}

export interface AccessoryExportedProperties extends ExportedProperties {
  wallID: number;
}

export interface RoomExportedProperties extends ExportedProperties {
  type: ViewProperty;
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