import {GRAB_JOINT_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {Point} from '../../../utils/index';
import {Point2PointDistance, Point2SegmentNearestPoint} from '../../../utils/math';
import {Joint} from '../../../view_elements/joint';
import * as ViewFactory from '../../../view_elements/view_factory';
import {Wall} from '../../../view_elements/wall';
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

    const grabWall = ViewFactory.GetGrabWall(pos);
    const grabJoint = ViewFactory.GetGrabJoint(pos);
    let wall: Wall;

    if (grabJoint) {
      wall = ViewFactory.CreateWall(grabJoint, pos);
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = Point2SegmentNearestPoint(
          pos, {p1: joint1.position, p2: joint2.position});

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
