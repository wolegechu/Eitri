import {ChangeToSelectionMode} from '../../..';
import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {GetClosestPointOnSegment2Point, Point} from '../../../utils';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {BaseState} from '../../state_machine';

import {DrawRectangleMachine} from './draw_rectangle_machine';

export class RectDrawingState extends BaseState {
  machine: DrawRectangleMachine;

  protected eventTable = [
    {
      event: EventSystem.EventType.MOUSE_MOVE_CANVAS,
      func: (e: EventSystem.FssEvent) => this.OnMouseMove(e)
    },
    {
      event: EventSystem.EventType.MOUSE_CLICK_CANVAS,
      func: (e: EventSystem.FssEvent) => this.OnMouseDown(e)
    }
  ];

  Enter(): void {
    super.Enter();
  }

  Leave(): void {
    super.Leave();
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    this.TryGrab(this.machine.upRightJoint);
    this.TryGrab(this.machine.downLeftJoint);
    this.TryGrab(this.machine.downRightJoint);
    ChangeToSelectionMode();
  }

  private OnMouseMove(e: EventSystem.FssEvent) {
    const pos = e.position;

    const posUpLeft = this.machine.upLeftJoint.position;
    const posDownRight = this.CalcGrabPosition(pos);
    const posDownLeft = this.CalcGrabPosition(new Point(posUpLeft.x, pos.y));
    const posUpRight = this.CalcGrabPosition(new Point(pos.x, posUpLeft.y));

    this.machine.downRightJoint.SetPosition(posDownRight);
    this.machine.downLeftJoint.SetPosition(posDownLeft);
    this.machine.upRightJoint.SetPosition(posUpRight);
  }

  /**
   * walls & joints try to grab the joint.
   */
  private TryGrab(joint: Joint): void {
    const pos = joint.position;
    const grabJoint = ViewFactory.GetNearestJoint(
        pos, this.machine.allJoints, GRAB_JOINT_DISTANCE);
    const grabWall = ViewFactory.GetNearestWall(
        pos, this.machine.allWalls, GRAB_WALL_DISTANCE);
    if (grabJoint) {
      joint.Merge(grabJoint);
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {ps: joint1.position, pe: joint2.position});
      joint.SetPosition(newPos);
      grabWall.Split(joint);
    }
  }

  /**
   * walls & joints try to grab the 'pos'
   * return the position after grab.
   */
  private CalcGrabPosition(pos: Point): Point {
    const grabJoint = ViewFactory.GetNearestJoint(
        pos, this.machine.allJoints, GRAB_JOINT_DISTANCE);
    const grabWall = ViewFactory.GetNearestWall(
        pos, this.machine.allWalls, GRAB_WALL_DISTANCE);
    if (grabJoint) {
      pos = grabJoint.position;
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      pos = GetClosestPointOnSegment2Point(
          pos, {ps: joint1.position, pe: joint2.position});
    }
    return pos;
  }
}
