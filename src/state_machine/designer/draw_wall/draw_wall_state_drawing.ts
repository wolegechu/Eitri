import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {Point} from '../../../utils';
import {ViewFactory} from '../../../view/view_factory';
import {BaseState} from '../../state_machine';

import {WallDrawingMachine} from './draw_wall_machine';
import {WallRangingState} from './draw_wall_state_ranging';


/*****
 * when Mouse Move: update the Wall, follow the mouse
 * when Click: crate a new Wall
 */
export class WallDrawingState extends BaseState {
  machine: WallDrawingMachine;

  protected eventTable = [
    {
      event: EventSystem.EventType.MOUSE_MOVE_CANVAS,
      func: (e: EventSystem.FssEvent) => this.OnMouseMove(e)
    },
    {
      event: EventSystem.EventType.MOUSE_CLICK_CANVAS,
      func: (e: EventSystem.FssEvent) => this.OnMouseDown(e)
    },
    {
      event: EventSystem.EventType.KEY_PRESS_NUMBER,
      func: (e: EventSystem.FssEvent) => this.OnNumberPress(e)
    },
    {
      event: EventSystem.EventType.KEY_PRESS_ENTER,
      func: (e: EventSystem.FssEvent) => this.OnEnterPress(e)
    },
    {
      event: EventSystem.EventType.KEY_PRESS_BACKSPACE,
      func: (e: EventSystem.FssEvent) => this.OnBackPress(e)
    },
  ];


  Enter(): void {
    console.debug('State DrawingState: Enter');
    super.Enter();
    this.machine.lengthInputCache = 0;
  }

  Leave(): void {
    console.debug('State DrawingState: Leave');
    super.Leave();
  }

  /**
   * when 'shift' key down, make the Wall align to axis
   * @param pos origin mouse position
   */
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

  private OnMouseMove(event: EventSystem.FssEvent): void {
    console.debug('drawing state mouse move');
    const joint = this.machine.lastJoint;
    const wall = this.machine.lastWall;
    let pos = event.position;
    if (event.shiftDown) pos = this.ShiftPosition(pos);

    const grabJoint =
        ViewFactory.GetNearestJoint(pos, [joint], GRAB_JOINT_DISTANCE);
    const grabWall =
        ViewFactory.GetNearestWall(pos, [wall], GRAB_WALL_DISTANCE);
    if (grabJoint && !event.shiftDown) {
      joint.SetPosition(grabJoint.position);
    } else if (grabWall) {
      const segment = grabWall.segment;
      const newPos = pos.distanceTo(segment)[1].end;

      joint.SetPosition(newPos);

    } else {
      joint.SetPosition(pos);
    }
  }

  private OnMouseDown(event: EventSystem.FssEvent): void {
    console.debug('drawing state mouse down');
    const joint = this.machine.lastJoint;
    const wall = this.machine.lastWall;
    let pos = event.position;
    if (event.shiftDown) pos = this.ShiftPosition(pos);

    const grabJoint =
        ViewFactory.GetNearestJoint(pos, [joint], GRAB_JOINT_DISTANCE);
    const grabWall =
        ViewFactory.GetNearestWall(pos, [wall], GRAB_WALL_DISTANCE);
    if (grabJoint && !event.shiftDown) {
      joint.Merge(grabJoint);
    } else if (grabWall) {
      grabWall.Split(joint);
    }

    const newWall = ViewFactory.CreateWall(pos, joint);
    this.machine.lastWall = newWall;
    this.machine.lastJoint = newWall.joint1;
    this.machine.Transition(new WallDrawingState(this.machine));
  }

  private OnNumberPress(event: EventSystem.FssEvent): void {
    let num = this.machine.lengthInputCache;
    num = num * 10 + event.digitNumber;
    this.machine.lengthInputCache = num;
    console.log(this.machine.lengthInputCache);
  }

  private OnBackPress(event: EventSystem.FssEvent): void {
    let num = this.machine.lengthInputCache;
    num = Math.floor(num / 10);
    this.machine.lengthInputCache = num;
    console.log(this.machine.lengthInputCache);
  }

  private OnEnterPress(event: EventSystem.FssEvent): void {
    if (!this.machine.lengthInputCache) return;
    this.machine.Transition(new WallRangingState(this.machine));
  }
}
