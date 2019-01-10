export abstract class ViewObject {
  id: number;
  protected view: fabric.Object;
  constructor(id: number) {
    this.id = id;
  }
}