import * as EventSystem from '../../../event_system';
import {ChangeToSelectionMode} from '../../../index';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {Wall} from '../../../view/canvas_components/wall';
import {StateMachine} from '../../state_machine';
import {WallIdleState} from './draw_wall_state_idle';

export class WallDrawingMachine extends StateMachine {
  lastWallID: number;
  lastJointID: number;
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

    // remove the last Wall
    const wall = ViewFactory.GetViewObject(this.lastWallID) as Wall;
    if (wall) wall.RemoveSelf();

    ViewFactory.Resolve();
  }

  /**
   * Get the pivot joint on the last wall.
   * You may ask what is pivot joint.
   * Pivot joint is the joint not move with mouse.
   */
  GetPivotJoint(): Joint {
    const lastWall = ViewFactory.GetViewObject(this.lastWallID) as Wall;

    const pivotJointID =
        lastWall.jointIDs[lastWall.jointIDs.indexOf(this.lastJointID) ^ 1];
    const pivotJoint = ViewFactory.GetViewObject(pivotJointID) as Joint;
    return pivotJoint;
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    ChangeToSelectionMode();
  }
}