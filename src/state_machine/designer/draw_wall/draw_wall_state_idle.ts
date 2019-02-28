import Flatten from 'flatten-js';

import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
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
      const segment = grabWall.segment;
      const newPos = pos.distanceTo(segment)[1].end;

      wall = ViewFactory.CreateWall(newPos, pos);
      const cutJoint = wall.joint1;
      grabWall.Split(cutJoint);
    } else {
      wall = ViewFactory.CreateWall(pos, pos);
    }

    this.machine.lastWall = wall;
    this.machine.lastJoint = wall.joint2;
    this.machine.Transition(new WallDrawingState(this.machine));
  }
}
