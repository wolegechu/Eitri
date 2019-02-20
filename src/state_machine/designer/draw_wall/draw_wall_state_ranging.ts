import * as EventSystem from '../../../events/index';
import {Point} from '../../../utils';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {Wall} from '../../../view/canvas_components/wall';
import {BaseState} from '../../state_machine';

import {WallDrawingMachine} from './draw_wall_machine';

/**
 * Use a certain length to ranging the wall
 */
export class RangingState extends BaseState {
  machine: WallDrawingMachine;

  private funcOnMouseMove = (e: EventSystem.FssEvent) => {
    this.OnMouseMove(e);
  };
  private funcOnMouseDown = (e: EventSystem.FssEvent) => {
    this.OnMouseDown(e);
  };

  Enter(): void {
    console.debug('State RangingState: Enter');

    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  Leave(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  private OnMouseMove(event: EventSystem.FssEvent): void {
    console.debug('Ranging State mouse move');

    // calculate moving point position
    let pos = event.position;
    if (event.shiftDown) pos = this.ShiftPosition(pos);
    pos = this.RangingPosition(pos);

    const joint = ViewFactory.GetViewObject(this.machine.lastJointID) as Joint;
    joint.SetPosition(pos);
  }

  private OnMouseDown(event: EventSystem.FssEvent): void {
    console.debug('Ranging State mouse down');

    // calculate moving point position
    let pos = event.position;
    if (event.shiftDown) pos = this.ShiftPosition(pos);
    pos = this.RangingPosition(pos);

    const joint = ViewFactory.GetViewObject(this.machine.lastJointID) as Joint;
    const newWall = ViewFactory.CreateWall(pos, joint);
    this.machine.lastWallID = newWall.id;
    this.machine.lastJointID = newWall.jointIDs[0];
    this.machine.Transition(event.type);
  }

  private ShiftPosition(pos: Point): Point {
    const pivotJoint = this.machine.GetPivotJoint();
    const dx = Math.abs(pos.x - pivotJoint.position.x);
    const dy = Math.abs(pos.y - pivotJoint.position.y);
    if (dx > dy) {
      return new Point(pos.x, pivotJoint.position.y);
    } else {
      return new Point(pivotJoint.position.x, pos.y);
    }
  }

  private RangingPosition(pos: Point): Point {
    const length = this.machine.lengthInputCache;
    const pivotPos = this.machine.GetPivotJoint().position;
    const vec = pos.clone().subtract(pivotPos).norm();
    const ret = pivotPos.clone().add(vec.multiplyScalar(length));
    return ret;
  }
}
