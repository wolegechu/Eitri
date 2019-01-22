import {fabric} from 'fabric';
import {Joint} from './joint';
import * as ViewFactory from './view_factory';
import {AccessoryExportedProperties, ViewObject} from './view_object';
import {Wall} from './wall';


/**
 * Represent things depend on Wall. Such as Window, Door.
 */
export class Room extends ViewObject {
  firstJointID: number;
  wallIDs: number[] = [];

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

  ExportProperties(): AccessoryExportedProperties {
    const properties: AccessoryExportedProperties = {id: this.id, wallID: 1};
    return properties;
  }
}
