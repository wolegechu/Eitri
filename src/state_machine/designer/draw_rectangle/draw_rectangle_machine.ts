import * as EventSystem from '../../../events/index';
import {ChangeToSelectionMode} from '../../../index';
import {Joint} from '../../../view_elements/joint';
import * as ViewFactory from '../../../view_elements/view_factory';
import {StateMachine} from '../../state_machine';


export class DrawRectangleMachine extends StateMachine {
  private isIdle = true;
  private upLeftJoint: Joint;
  private upRightJoint: Joint;
  private downLeftJoint: Joint;
  private downRightJoint: Joint;

  protected transisionTable: [];

  private funcOnMouseMove = (e: EventSystem.FssEvent) => {
    this.OnMouseMove(e);
  };
  private funcOnMouseDown = (e: EventSystem.FssEvent) => {
    this.OnMouseDown(e);
  };

  constructor() {
    super();
    console.debug('Enter Draw Rectangle Mode');
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.AddEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  Exit(): void {
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_MOVE_CANVAS, this.funcOnMouseMove);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.MOUSE_CLICK_CANVAS, this.funcOnMouseDown);
  }

  private OnMouseMove(e: EventSystem.FssEvent) {
    if (this.isIdle) return;
    const pos = e.position;
    const upLeftPos = this.upLeftJoint.position;
    this.downRightJoint.SetPosition(pos);
    this.downLeftJoint.SetPosition({x: upLeftPos.x, y: pos.y});
    this.upRightJoint.SetPosition({x: pos.x, y: upLeftPos.y});
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    if (this.isIdle) {
      this.isIdle = false;

      const pos = e.position;
      this.upLeftJoint = ViewFactory.CreateJoint(pos);
      this.upRightJoint = ViewFactory.CreateJoint(pos);
      this.downLeftJoint = ViewFactory.CreateJoint(pos);
      this.downRightJoint = ViewFactory.CreateJoint(pos);

      const upWall =
          ViewFactory.CreateWall(this.upLeftJoint, this.upRightJoint);
      const downWall =
          ViewFactory.CreateWall(this.downLeftJoint, this.downRightJoint);
      const leftWall =
          ViewFactory.CreateWall(this.upLeftJoint, this.downLeftJoint);
      const rightWall =
          ViewFactory.CreateWall(this.upRightJoint, this.downRightJoint);

    } else {
      ChangeToSelectionMode();
    }
  }
}