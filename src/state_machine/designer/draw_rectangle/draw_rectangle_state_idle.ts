import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {GetClosestPointOnSegment2Point} from '../../../utils';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {BaseState} from '../../state_machine';

import {DrawRectangleMachine} from './draw_rectangle_machine';
import {RectDrawingState} from './draw_rectangle_state_drawing';

export class RectIdleState extends BaseState {
  machine: DrawRectangleMachine;

  protected eventTable = [{
    event: EventSystem.EventType.MOUSE_CLICK_CANVAS,
    func: (e: EventSystem.FssEvent) => this.OnMouseDown(e)
  }];

  Enter(): void {
    super.Enter();
  }

  Leave(): void {
    super.Leave();
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    const pos = e.position;

    let upLeftJoint: Joint;

    // joint & wall try to grab mouse
    const grabJoint = ViewFactory.GetNearestJoint(pos, [], GRAB_JOINT_DISTANCE);
    const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
    if (grabJoint) {
      upLeftJoint = grabJoint;
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {a: joint1.position, b: joint2.position});

      upLeftJoint = ViewFactory.CreateJoint(newPos);
      grabWall.Split(upLeftJoint);
    } else {
      upLeftJoint = ViewFactory.CreateJoint(pos);
    }

    this.machine.SetJointAndCreateWall(
        upLeftJoint, ViewFactory.CreateJoint(pos), ViewFactory.CreateJoint(pos),
        ViewFactory.CreateJoint(pos));

    this.machine.Transition(new RectDrawingState(this.machine));
  }
}
