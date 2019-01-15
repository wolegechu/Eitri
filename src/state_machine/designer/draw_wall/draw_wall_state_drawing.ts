import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {Point} from '../../../utils';
import {GetDistanceByPoint2Point, GetPointByPoint2LineSegment} from '../../../utils/math';
import {Joint} from '../../../view_elements/joint';
import * as ViewFactory from '../../../view_elements/view_factory';
import {Wall} from '../../../view_elements/wall';
import {BaseState} from '../../state_machine';

import {WallDrawingMachine} from './draw_wall_machine';


/*****
 * when Mouse Move: update the Wall, follow the mouse
 * when Click: crate a new Wall
 */
export class DrawingState extends BaseState {
  machine: WallDrawingMachine;

  private funcOnMouseMove = (e: EventSystem.FssEvent) => {
    this.OnMouseMove(e);
  };
  private funcOnMouseDown = (e: EventSystem.FssEvent) => {
    this.OnMouseDown(e);
  };

  Enter(): void {
    console.debug('State DrawingState: Enter');

    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  Leave(): void {
    console.debug('State DrawingState: Leave');

    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  /**
   * when 'shift' key down, make the Wall align to axis
   */
  private ShiftPosition(pos: Point): Point {
    const lastWall = ViewFactory.GetViewObject(this.machine.lastWallID) as Wall;
    const pivotJointID =
        lastWall
            .jointIDs[lastWall.jointIDs.indexOf(this.machine.lastJointID) ^ 1];
    const pivotJoint = ViewFactory.GetViewObject(pivotJointID) as Joint;
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
    const joint = ViewFactory.GetViewObject(this.machine.lastJointID) as Joint;
    const wall = ViewFactory.GetViewObject(this.machine.lastWallID) as Wall;
    const pos = event.position;

    const grabJoint =
        ViewFactory.GetNearestJoint(pos, [joint], GRAB_JOINT_DISTANCE);
    const grabWall =
        ViewFactory.GetNearestWall(pos, [wall], GRAB_WALL_DISTANCE);
    if (grabJoint && !event.shiftDown) {
      joint.SetPosition(grabJoint.position);
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetPointByPoint2LineSegment(
          pos, {a: joint1.position, b: joint2.position});

      joint.SetPosition(newPos);

    } else {
      let newPos = pos;
      if (event.shiftDown) newPos = this.ShiftPosition(pos);
      joint.SetPosition(newPos);
    }
  }

  private OnMouseDown(event: EventSystem.FssEvent): void {
    console.debug('drawing state mouse down');
    const joint = ViewFactory.GetViewObject(this.machine.lastJointID) as Joint;
    const wall = ViewFactory.GetViewObject(this.machine.lastWallID) as Wall;
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
    this.machine.lastWallID = newWall.id;
    this.machine.lastJointID = newWall.jointIDs[0];
  }
}
