import Flatten from 'flatten-js';

import * as EventSystem from '../../../event_system';
import {Point} from '../../../utils';
import {Joint} from '../../../view/canvas_components/joint';
import {Wall} from '../../../view/canvas_components/wall';
import {ViewFactory} from '../../../view/view_factory';
import {BaseState} from '../../state_machine';

import {WallDrawingMachine} from './draw_wall_machine';
import {WallDrawingState} from './draw_wall_state_drawing';

/**
 * Use a certain length to ranging the wall
 */
export class WallRangingState extends BaseState {
  machine: WallDrawingMachine;

  protected eventTable = [
    {
      event: EventSystem.EventType.MOUSE_CLICK_CANVAS,
      func: (e: EventSystem.FssEvent) => this.OnMouseDown(e)
    },
    {
      event: EventSystem.EventType.MOUSE_MOVE_CANVAS,
      func: (e: EventSystem.FssEvent) => this.OnMouseMove(e)
    },
  ];

  Enter(): void {
    console.debug('State RangingState: Enter');
    super.Enter();
  }

  Leave(): void {
    super.Leave();
  }

  private OnMouseMove(event: EventSystem.FssEvent): void {
    console.debug('Ranging State mouse move');

    // calculate moving point position
    let pos = event.position;
    if (event.shiftDown) pos = this.ShiftPosition(pos);
    pos = this.RangingPosition(pos);
    this.machine.lastJoint.SetPosition(pos);
  }

  private OnMouseDown(event: EventSystem.FssEvent): void {
    console.debug('Ranging State mouse down');

    // calculate moving point position
    let pos = event.position;
    if (event.shiftDown) pos = this.ShiftPosition(pos);
    pos = this.RangingPosition(pos);

    const newWall = ViewFactory.CreateWall(pos, this.machine.lastJoint);
    this.machine.lastWall = newWall;
    this.machine.lastJoint = newWall.joint1;
    this.machine.Transition(new WallDrawingState(this.machine));
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
    const vec = new Flatten.Vector(pivotPos, pos).normalize();
    const ret = pivotPos.translate(vec.multiply(length));
    return ret;
  }
}
