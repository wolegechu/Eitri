import * as EventSystem from '../../../events/index';
import {ChangeToSelectionMode} from '../../../index';
import * as ViewFactory from '../../../view_elements/view_factory';
import {Wall} from '../../../view_elements/wall';
import {StateMachine} from '../../state_machine';

import {DrawingState} from './draw_wall_state_drawing';
import {IdleState} from './draw_wall_state_idle';
import {RangingState} from './draw_wall_state_ranging';

export class WallDrawingMachine extends StateMachine {
  lastWallID: number;
  lastJointID: number;

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
  ];

  constructor() {
    super();
    this.InitState(this.idleState);

    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ENTER, this.funcOnPressESC);
  }

  Exit(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ENTER, this.funcOnPressESC);
    this.state.Leave();

    // remove the last Wall
    const wall = ViewFactory.GetViewObject(this.lastWallID) as Wall;
    if (wall) wall.RemoveSelf();
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    ChangeToSelectionMode();
  }
}