import * as EventSystem from '../../../events/index';
import {ChangeToSelectionMode} from '../../../index';
import {Joint} from '../../../view/drawing_board/joint';
import * as ViewFactory from '../../../view/drawing_board/view_factory';
import {Wall} from '../../../view/drawing_board/wall';
import {StateMachine} from '../../state_machine';

import {DrawingState} from './draw_wall_state_drawing';
import {IdleState} from './draw_wall_state_idle';
import {RangingState} from './draw_wall_state_ranging';

export class WallDrawingMachine extends StateMachine {
  lastWallID: number;
  lastJointID: number;
  lengthInputCache: number;

  idleState: IdleState = new IdleState(this);
  drawingState: DrawingState = new DrawingState(this);
  rangingState: RangingState = new RangingState(this);

  funcOnPressESC = (e: EventSystem.FssEvent) => {
    this.OnPressESC(e);
  };

  protected transisionTable = [
    {
      origin: this.idleState,
      target: this.drawingState,
      event: EventSystem.EventType.MOUSE_CLICK_CANVAS
    },
    {
      origin: this.drawingState,
      target: this.drawingState,
      event: EventSystem.EventType.MOUSE_CLICK_CANVAS
    },
    {
      origin: this.drawingState,
      target: this.rangingState,
      event: EventSystem.EventType.KEY_PRESS_ENTER
    },
    {
      origin: this.rangingState,
      target: this.drawingState,
      event: EventSystem.EventType.MOUSE_CLICK_CANVAS
    }
  ];

  constructor() {
    super();
    this.InitState(this.idleState);

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