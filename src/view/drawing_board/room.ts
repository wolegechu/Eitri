import {fabric} from 'fabric';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {AccessoryExportedProperties, ViewObject, ExportedProperties, RoomExportedProperties, PROPERTY_TYPE_ROOM_TYPE} from './view_object';
import {Wall} from './wall';

export enum RoomType {
  Bedroom = "卧室",
  LivingRoom = "客厅",
  Kitchen = "厨房",
  Toilet = "厕所",
}

/**
 * Represent things depend on Wall. Such as Window, Door.
 */
export class Room extends ViewObject {
  firstJointID: number;
  wallIDs: number[] = [];
  type: string = RoomType.Bedroom;

  constructor(id: number, walls: Wall[], firstJoint: Joint) {
    super(id);

    this.firstJointID = firstJoint.id;
    walls.forEach(wall => {
      this.wallIDs.push(wall.id);
    });

    const path: string[] = [];
    let nextID: number;
    path.push('M');

    let joint = firstJoint;
    let index: number;
    for (const wall of walls) {
      path.push(joint.position.x.toString());
      path.push(joint.position.y.toString());
      path.push('L');

      index = wall.jointIDs.indexOf(joint.id);
      console.assert(index !== -1, 'wrong wall, wrong joint');
      nextID = wall.jointIDs[index ^ 1];
      joint = ViewFactory.GetViewObject(nextID) as Joint;
    }

    path[path.length - 1] = 'z';

    this.view = new fabric.Path(path.join(' '), {
      fill: '#A2875E',
      stroke: '#A2875E',
      opacity: 0.1,
      lockMovementX: true,
      lockMovementY: true
    });
    this.view.hasControls = this.view.hasBorders = false;
    this.view.perPixelTargetFind = true;
  }

  ExportProperties(): RoomExportedProperties {
    const properties: RoomExportedProperties = {
      type: {
        value: this.type,
        type: PROPERTY_TYPE_ROOM_TYPE
      }
    };
    return properties;
  }

  ImportProperties(props: RoomExportedProperties): void {
    this.type = props.type.value;
  }
}
