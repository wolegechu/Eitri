import {fabric} from 'fabric';

import {ViewCanvas} from './canvas';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {ObjectOptions, PROPERTY_TYPE_OPTION, RoomExportedProperties, ViewObject} from './view_object';

const UNSELECTED_COLOR = '#A2875E';

export enum RoomType {
  Bedroom = '卧室',
  LivingRoom = '客厅',
  Kitchen = '厨房',
  Toilet = '厕所',
}


interface RoomOption extends ObjectOptions {
  jointIDs?: number[];
  type?: string;
}

/**
 * Represent things depend on Wall. Such as Window, Door.
 */
export class Room extends ViewObject {
  static typeName = 'room';
  get typeName() {
    return Room.typeName;
  }

  private jointIDs: number[] = [];
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

  ToJson(): ObjectOptions {
    return Object.assign({}, this, {view: undefined});
  }

  OnSelect(): void {
    this.view.set({fill: '#82673E'});
  }

  OnUnSelect(): void {
    this.view.set({fill: UNSELECTED_COLOR});
  }

  UpdateView(): void {
    const path: string[] = [];
    path.push('M');

    for (const jointID of this.jointIDs) {
      const joint = ViewFactory.GetViewObject(jointID) as Joint;
      if (!joint) return;

      path.push(joint.position.x.toString());
      path.push(joint.position.y.toString());
      path.push('L');
    }

    path[path.length - 1] = 'z';
    this.NewFabricPath(path.join(' '));

    this.view.setCoords();
    ViewCanvas.GetInstance().Render();
  }

  protected Set(option: RoomOption): void {
    if (option.jointIDs !== undefined) {
      this.jointIDs = option.jointIDs;
    }
    if (option.type !== undefined) {
      this.type = option.type;
    }

    this.UpdateView();
  }

  private NewFabricPath(path: string) {
    // when change 'view', factory should be reseted.
    ViewFactory.RemoveObject(this);

    this.view = new fabric.Path(path, {
      fill: UNSELECTED_COLOR,
      opacity: 0.4,
      lockMovementX: true,
      lockMovementY: true
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;

    ViewFactory.AddObject(this);
  }
}
