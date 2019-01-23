import {fabric} from 'fabric';

import {GetDistanceOfPoint2Point, Point} from '../../utils';

import {Accessory} from './accessory';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {PROPERTY_TYPE_NUMBER, ViewObject, WallExportedProperties, ObjectOptions, PROPERTY_TYPE_OPTION} from './view_object';
import { ViewCanvas } from './canvas';

export enum WallType {
  NORMAL = '普通墙',
  MAIN = '承重墙'
}

export class Wall extends ViewObject {
  jointIDs: number[] = [];
  accessoryIDs: number[] = [];
  width = 10;
  view: fabric.Line;
  type = WallType.NORMAL;

  get length(): number {
    const joint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;

    const length = GetDistanceOfPoint2Point(joint1.position, joint2.position);
    return length;
  }

  constructor(id: number, point1: Joint, point2: Joint) {
    super(id);

    point1.AddWallID(this.id);
    point2.AddWallID(this.id);

    this.jointIDs.push(point1.id);
    this.jointIDs.push(point2.id);

    const p1 = point1.position;
    const p2 = point2.position;

    this.view = new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      strokeWidth: 9,
      stroke: '#808080',
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;
    
    ViewCanvas.GetInstance().Add(this);
  }

  /**
   * Split the wall to two walls through a joint between two ends of the wall.
   */
  Split(cutJoint: Joint) {
    const endJoint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const endJoint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;
    ViewFactory.CreateWall(cutJoint, endJoint1);
    ViewFactory.CreateWall(cutJoint, endJoint2);
    this.RemoveSelf();
  }

  ExportProperties(): WallExportedProperties {
    const properties = new WallExportedProperties();
    properties.length = {value: this.length, type: PROPERTY_TYPE_NUMBER};
    properties.type = {
        value: this.type,
        type: PROPERTY_TYPE_OPTION,
        options: [WallType.MAIN, WallType.NORMAL]
    };
    return properties;
  }

  ImportProperties(props: WallExportedProperties) {
    //this.length = props.length.value;
    this.type = props.type.value;
  }

  ToJson(): string {
    throw new Error("Method not implemented.");
  }

  Set(option: ObjectOptions): void {
    throw new Error("Method not implemented.");
  }

  UpdateView(): void {
    throw new Error("Method not implemented.");
  }

  UpdatePosition() {
    const joint1 = ViewFactory.GetViewObject(this.jointIDs[0]) as Joint;
    const joint2 = ViewFactory.GetViewObject(this.jointIDs[1]) as Joint;

    this.view.set({
      'x1': joint1.position.x,
      'y1': joint1.position.y,
      'x2': joint2.position.x,
      'y2': joint2.position.y,
    });
    this.view.setCoords();

    this.accessoryIDs.forEach(id => {
      const obj = ViewFactory.GetViewObject(id) as Accessory;
      obj.OnWallMove();
    });
  }

  RemoveSelf() {
    super.RemoveSelf();
    this.jointIDs.forEach(jointID => {
      const joint = ViewFactory.GetViewObject(jointID) as Joint;
      joint.RemoveWallID(this.id);
    });
  }

  AddAccessoryID(id: number) {
    const index = this.accessoryIDs.indexOf(id);
    if (index === -1) this.accessoryIDs.push(id);
  }

  RemoveAccessoryID(id: number) {
    const index = this.accessoryIDs.indexOf(id);
    if (index !== -1) this.accessoryIDs.splice(index, 1);
  }

  private GetOrCreateJoint(point: Point|Joint): Joint {
    let joint: Joint;

    if (point instanceof Joint) {
      joint = (point as Joint);
    } else {
      joint = ViewFactory.CreateJoint(point);
    }

    return joint;
  }
}