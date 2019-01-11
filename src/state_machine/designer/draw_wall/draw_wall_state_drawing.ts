import * as EventSystem from '../../../events/index';
import {Joint} from '../../../view_elements/joint';
import * as ViewFactory from '../../../view_elements/view_factory';
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

  private OnMouseMove(event: EventSystem.FssEvent): void {
    const joint = ViewFactory.GetViewObject(this.machine.lastJointID) as Joint;
    joint.SetPosition(event.position);
  }

  private OnMouseDown(event: EventSystem.FssEvent): void {
    const joint = ViewFactory.GetViewObject(this.machine.lastJointID) as Joint;
    const pos = event.position;
    const wall = ViewFactory.CreateWall(pos, joint);
    this.machine.lastWallID = wall.id;
    this.machine.lastJointID = wall.jointIDs[0];
  }
}
