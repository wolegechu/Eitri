import * as EventSystem from '../../../events/index';
import * as ViewFactory from '../../../view_elements/view_factory';
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
    const pos = event.position;
    const wall = ViewFactory.CreateWall(pos, pos);
    this.machine.lastWallID = wall.id;
    this.machine.lastJointID = wall.jointIDs[1];
    this.machine.Transition(event.type);
  }
}
