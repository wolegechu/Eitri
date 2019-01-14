import {GRAB_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {Point} from '../../../utils/index';
import {GetDistance} from '../../../utils/math';
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

    let wall: Wall;
    // the Joint grab mouse
    const grabJoint = ViewFactory.GetGrabJoint(pos);
    if (grabJoint) {
      wall = ViewFactory.CreateWall(grabJoint, pos);
    } else {
      wall = ViewFactory.CreateWall(pos, pos);
    }

    this.machine.lastWallID = wall.id;
    this.machine.lastJointID = wall.jointIDs[1];
    this.machine.Transition(event.type);
  }
}
