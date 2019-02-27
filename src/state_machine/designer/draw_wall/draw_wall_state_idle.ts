import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {GetClosestPointOnSegment2Point, GetDistanceOfPoint2Point} from '../../../utils/math';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {Wall} from '../../../view/canvas_components/wall';
import {BaseState} from '../../state_machine';

import {WallDrawingMachine} from './draw_wall_machine';
import {WallDrawingState} from './draw_wall_state_drawing';


/*****
 * when Click: create non-static wall (move with mouse)
 */
export class WallIdleState extends BaseState {
  machine: WallDrawingMachine;

  protected eventTable = [{
    event: EventSystem.EventType.MOUSE_CLICK_CANVAS,
    func: (e: EventSystem.FssEvent) => this.OnClick(e)
  }];

  Enter(): void {
    super.Enter();
  }

  Leave(): void {
    super.Leave();
  }

  private OnClick(event: EventSystem.FssEvent): void {
    console.debug('idle state on click');
    const pos = event.position;

    const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
    const grabJoint = ViewFactory.GetNearestJoint(pos, [], GRAB_JOINT_DISTANCE);
    let wall: Wall;

    if (grabJoint) {
      wall = ViewFactory.CreateWall(grabJoint, pos);
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {ps: joint1.position, pe: joint2.position});

      wall = ViewFactory.CreateWall(newPos, pos);
      const cutJoint = ViewFactory.GetViewObject(wall.jointIDs[0]) as Joint;
      grabWall.Split(cutJoint);
    } else {
      wall = ViewFactory.CreateWall(pos, pos);
    }

    this.machine.lastWallID = wall.id;
    this.machine.lastJointID = wall.jointIDs[1];
    this.machine.Transition(new WallDrawingState(this.machine));
  }
}
