import * as EventSystem from '../../../event_system';
import {ChangeToSelectionMode} from '../../../index';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {Wall} from '../../../view/canvas_components/wall';
import {StateMachine} from '../../state_machine';
import {WallIdleState} from './draw_wall_state_idle';

export class WallDrawingMachine extends StateMachine {
  lastWall: Wall;
  lastJoint: Joint;
  lengthInputCache: number;

  funcOnPressESC = (e: EventSystem.FssEvent) => {
    this.OnPressESC(e);
  };

  constructor() {
    super();
    this.InitState(new WallIdleState(this));

    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
  }

  Exit(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
    this.state.Leave();

    if (this.lastWall) this.lastWall.RemoveSelf();

    ViewFactory.Resolve();
  }

  /**
   * Get the pivot joint on the last wall.
   * You may ask what is pivot joint.
   * Pivot joint is the joint not move with mouse.
   */
  GetPivotJoint(): Joint {
    const lastWall = this.lastWall;

    const pivotJoint =
        lastWall.joint1 === this.lastJoint ? lastWall.joint2 : lastWall.joint1;
    return pivotJoint;
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    ChangeToSelectionMode();
  }
}