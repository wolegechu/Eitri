import {ChangeToSelectionMode} from '../../..';
import {GRAB_WALL_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {ImageHandle} from '../../../ImageManager';
import {GetClosestPointOnSegment2Point, Point} from '../../../utils';
import {Accessory} from '../../../view/canvas_components/accessory';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {StateMachine} from '../../state_machine';

export class DrawWindowMachine extends StateMachine {
  viewWindow: Accessory;
  finished = false;

  protected transisionTable: [];

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

    this.viewWindow = ViewFactory.CreateAccessory(ImageHandle.DOOR);
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

  private OnMouseMove(e: EventSystem.FssEvent) {
    const pos = e.position;

    const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
    if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {a: joint1.position, b: joint2.position});

      this.viewWindow.SetPosition(newPos);
      this.viewWindow.SetWallID(grabWall.id);

    } else {
      this.viewWindow.SetPosition(e.position);
    }
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    const pos = e.position;

    const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
    if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {a: joint1.position, b: joint2.position});

      this.viewWindow.SetPosition(newPos);
      this.viewWindow.SetWallID(grabWall.id);

      this.finished = true;
    }

    ChangeToSelectionMode();
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    ChangeToSelectionMode();
  }
}