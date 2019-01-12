import {ViewCanvas} from './canvas';
import * as ViewFactory from './view_factory';


export abstract class ViewObject {
  id: number;
   view: fabric.Object;

  constructor(id: number) {
    this.id = id;
  }

  RemoveSelf() {
    ViewCanvas.GetInstance().Remove(this.view);
    ViewFactory.RemoveObject(this.id);
  }
}