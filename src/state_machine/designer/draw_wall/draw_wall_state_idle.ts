import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {Point} from '../../../utils/index';
import {GetDistanceOfPoint2Point, GetClosestPointOnSegment2Point} from '../../../utils/math';
import { Joint } from '../../../view/drawing_board/joint';
import * as ViewFactory from '../../../view/drawing_board/view_factory';
import { Wall } from '../../../view/drawing_board/wall';
import {BaseState} from '../../state_machine';
import {WallDrawingMachine} from './draw_wall_machine';


/*****
 * when Click: create non-static wall (move with mouse)
 */
export class IdleState extends BaseState {
  machine: WallDrawingMachine;

  private funcOnClick = (e: EventSystem.FssEvent) => {
    this.OnClick(e);
  };

  Enter(): void {
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnClick);
  }

  Leave(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnClick);
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
          pos, {a: joint1.position, b: joint2.position});

      wall = ViewFactory.CreateWall(newPos, pos);
      const cutJoint = ViewFactory.GetViewObject(wall.jointIDs[0]) as Joint;
      grabWall.Split(cutJoint);
    } else {
      wall = ViewFactory.CreateWall(pos, pos);
    }

    this.machine.lastWallID = wall.id;
    this.machine.lastJointID = wall.jointIDs[1];
    this.machine.Transition(event.type);
  }
}
