import Flatten from 'flatten-js';

import {ChangeToSelectionMode} from '../../..';
import {GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {Point} from '../../../utils';
import {Accessory} from '../../../view/canvas_components/accessory';
import {ViewFactory} from '../../../view/view_factory';
import {StateMachine} from '../../state_machine';

export class DrawWindowMachine extends StateMachine {
  viewWindow: Accessory;
  finished = false;

  private funcOnMouseMove = (e: EventSystem.FssEvent) => {
    this.OnMouseMove(e);
  };
  private funcOnMouseDown = (e: EventSystem.FssEvent) => {
    this.OnMouseDown(e);
  };
  private funcOnPressESC = (e: EventSystem.FssEvent) => {
    this.OnPressESC(e);
  };

  constructor() {
    super();
    console.debug('Enter Draw Window Mode');
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);

    this.viewWindow = ViewFactory.CreateAccessory('door');
  }

  Exit(): void {
    if (!this.finished) this.viewWindow.RemoveSelf();

    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
  }

  private UpdateViewByMouse(pos: Point) {
    const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
    if (grabWall) {
      const segment = grabWall.segment;
      const newPos = pos.distanceTo(segment)[1].end;

      this.viewWindow.SetPosition(newPos);
      this.viewWindow.SetWallID(grabWall.id);

    } else {
      this.viewWindow.SetPosition(pos);
    }
  }

  private OnMouseMove(e: EventSystem.FssEvent) {
    this.UpdateViewByMouse(e.position);
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    this.UpdateViewByMouse(e.position);
    this.finished = true;
    ChangeToSelectionMode();
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    ChangeToSelectionMode();
  }
}