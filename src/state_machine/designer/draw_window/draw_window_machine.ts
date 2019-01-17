import {fabric} from 'fabric';

import {ChangeToSelectionMode} from '../../..';
import {GRAB_WALL_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {GetClosestPointOnSegment2Point, Point} from '../../../utils';
import {Accessory} from '../../../view/drawing_board/accessory';
import {ViewCanvas} from '../../../view/drawing_board/canvas';
import {Joint} from '../../../view/drawing_board/joint';
import * as ViewFactory from '../../../view/drawing_board/view_factory';
import {StateMachine} from '../../state_machine';

export class DrawWindowMachine extends StateMachine {
  viewWindow: Accessory;

  protected transisionTable: [];

  private funcOnMouseMove = (e: EventSystem.FssEvent) => {
    this.OnMouseMove(e);
  };
  private funcOnMouseDown = (e: EventSystem.FssEvent) => {
    this.OnMouseDown(e);
  };

  constructor() {
    super();
    console.debug('Enter Draw Window Mode');
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);

    const imgSource = require('../../../images/door.png');
    const imgElement = new Image();
    imgElement.src = imgSource;
    imgElement.onload = () => {
      this.viewWindow =
          ViewFactory.CreateAccessory(new Point(100, 100), imgElement);
    };
  }

  Exit(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  private OnMouseMove(e: EventSystem.FssEvent) {
    const pos = e.position;

    const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
    if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {a: joint1.position, b: joint2.position});

      this.viewWindow.SetPositionAndWall(newPos, grabWall);
    } else {
      this.viewWindow.SetPositionAndWall(e.position);
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

      this.viewWindow.SetPositionAndWall(newPos, grabWall);
    } else {
      this.viewWindow.RemoveSelf();
    }

    ChangeToSelectionMode();
  }
}