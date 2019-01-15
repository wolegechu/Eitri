import {GRAB_JOINT_DISTANCE} from '../../../CONFIG';
import * as EventSystem from '../../../events/index';
import {ChangeToSelectionMode} from '../../../index';
import {GetDistanceOfPoint2Point, Point} from '../../../utils';
import {Joint} from '../../../view/drawing_board/joint';
import * as ViewFactory from '../../../view/drawing_board/view_factory';
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
    let pos = e.position;

    // the Joint grab mouse
    const grabJoint = ViewFactory.GetNearestJoint(
        pos, [this.downRightJoint], GRAB_JOINT_DISTANCE);
    if (grabJoint) pos = grabJoint.position;

    const upLeftPos = this.upLeftJoint.position;
    this.downRightJoint.SetPosition(pos);
    this.downLeftJoint.SetPosition(new Point(upLeftPos.x, pos.y));
    this.upRightJoint.SetPosition(new Point(pos.x, upLeftPos.y));
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    const pos = e.position;

    if (this.isIdle) {
      this.isIdle = false;

      // the Joint grab mouse
      const grabJoint =
          ViewFactory.GetNearestJoint(pos, [], GRAB_JOINT_DISTANCE);
      if (grabJoint) {
        this.upLeftJoint = grabJoint;
      } else {
        this.upLeftJoint = ViewFactory.CreateJoint(pos);
      }

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
      // the Joint grab mouse
      const grabJoint = ViewFactory.GetNearestJoint(
          pos, [this.downRightJoint], GRAB_JOINT_DISTANCE);
      if (grabJoint) this.downRightJoint.Merge(grabJoint);
      ChangeToSelectionMode();
    }
  }
}