import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';

export class ExportedProperties {
  id: number;
}

export interface WallExportedProperties extends ExportedProperties {
  // id: number;
  length: number;
}

export interface JointExportedProperties extends ExportedProperties {
  x: number;
  y: number;
}

export interface AccessoryExportedProperties extends ExportedProperties {
  wallID: number;
}

export abstract class ViewObject {
  id: number;
  view: fabric.Object;

  // exposure properties. It's usually used by the UIView.
  abstract ExportProperties(): ExportedProperties;

  constructor(id: number) {
    this.id = id;
  }

  RemoveSelf() {
    ViewCanvas.GetInstance().Remove(this.view);
    ViewFactory.RemoveObject(this);
  }
}