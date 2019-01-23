import {fabric} from 'fabric';

import {ViewCanvas} from './canvas';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {ObjectOptions, PROPERTY_TYPE_OPTION, RoomExportedProperties, ViewObject} from './view_object';
import {Wall} from './wall';

export enum RoomType {
  Bedroom = '卧室',
  LivingRoom = '客厅',
  Kitchen = '厨房',
  Toilet = '厕所',
}


interface RoomOption extends ObjectOptions {
  firstJointID?: number;
  wallIDs?: number[];
  type?: string;
}


/**
 * Represent things depend on Wall. Such as Window, Door.
 */
export class Room extends ViewObject {
  private firstJointID = -1;
  private wallIDs: number[] = [];
  private type: string = RoomType.Bedroom;

  view: fabric.Path;

  constructor(id: number, option: RoomOption) {
    super(id);
    this.NewFabricPath('');
    this.Set(option);
  }

  ExportProperties(): RoomExportedProperties {
    const properties = new RoomExportedProperties();

    properties.type = {
      value: this.type,
      type: PROPERTY_TYPE_OPTION,
      options: [
        RoomType.Bedroom, RoomType.Kitchen, RoomType.LivingRoom, RoomType.Toilet
      ]
    };
    return properties;
  }

  ImportProperties(props: RoomExportedProperties): void {
    this.type = props.type.value;
  }

  ToJson(): string {
    return JSON.stringify(Object.assign({}, this, {view: undefined}));
  }

  UpdateView(): void {
    const path: string[] = [];
    let nextID: number;
    path.push('M');

    let joint = ViewFactory.GetViewObject(this.firstJointID) as Joint;
    if (!joint) return;

    let index: number;
    for (const wallID of this.wallIDs) {
      const wall = ViewFactory.GetViewObject(wallID) as Wall;
      if (!wall) return;

      path.push(joint.position.x.toString());
      path.push(joint.position.y.toString());
      path.push('L');

      index = wall.jointIDs.indexOf(joint.id);
      console.assert(index !== -1, 'wrong wall, wrong joint');
      nextID = wall.jointIDs[index ^ 1];
      joint = ViewFactory.GetViewObject(nextID) as Joint;
    }

    path[path.length - 1] = 'z';
    this.NewFabricPath(path.join(' '));

    this.view.setCoords();
    ViewCanvas.GetInstance().Render();
  }

  protected Set(option: RoomOption): void {
    if (option.firstJointID) {
      this.firstJointID = option.firstJointID;
    }
    if (option.wallIDs) {
      this.wallIDs = option.wallIDs;
    }
    if (option.type) {
      this.type = option.type;
    }

    this.UpdateView();
  }

  private NewFabricPath(path: string) {
    if (this.view) {
      ViewCanvas.GetInstance().Remove(this);
    }
    this.view = new fabric.Path(path, {
      fill: '#A2875E',
      stroke: '#A2875E',
      opacity: 0.1,
      lockMovementX: true,
      lockMovementY: true
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    ViewCanvas.GetInstance().Add(this);
  }
}
