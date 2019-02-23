import {GRAB_JOINT_DISTANCE, GRAB_WALL_DISTANCE} from '../../../config/CONFIG';
import * as EventSystem from '../../../event_system';
import {ChangeToSelectionMode} from '../../../index';
import {GetClosestPointOnSegment2Point, GetDistanceOfPoint2Point, Point} from '../../../utils';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {Wall} from '../../../view/canvas_components/wall';
import {StateMachine} from '../../state_machine';


export class DrawRectangleMachine extends StateMachine {
  private isIdle = true;
  private upLeftJoint: Joint;
  private upRightJoint: Joint;
  private downLeftJoint: Joint;
  private downRightJoint: Joint;
  private allJoints: Joint[] = [];

  private upWall: Wall;
  private downWall: Wall;
  private leftWall: Wall;
  private rightWall: Wall;
  private allWalls: Wall[] = [];

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

    ViewFactory.Resolve();
  }

  private OnMouseMove(e: EventSystem.FssEvent) {
    if (this.isIdle) return;
    const pos = e.position;

    const posUpLeft = this.upLeftJoint.position;
    const posDownRight = this.CalcGrabPosition(pos);
    const posDownLeft = this.CalcGrabPosition(new Point(posUpLeft.x, pos.y));
    const posUpRight = this.CalcGrabPosition(new Point(pos.x, posUpLeft.y));

    this.downRightJoint.SetPosition(posDownRight);
    this.downLeftJoint.SetPosition(posDownLeft);
    this.upRightJoint.SetPosition(posUpRight);
  }

  private OnMouseDown(e: EventSystem.FssEvent) {
    const pos = e.position;

    if (this.isIdle) {
      this.isIdle = false;

      // joint & wall try to grab mouse
      const grabJoint =
          ViewFactory.GetNearestJoint(pos, [], GRAB_JOINT_DISTANCE);
      const grabWall = ViewFactory.GetNearestWall(pos, [], GRAB_WALL_DISTANCE);
      if (grabJoint) {
        this.upLeftJoint = grabJoint;
      } else if (grabWall) {
        const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
        const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

        const newPos = GetClosestPointOnSegment2Point(
            pos, {a: joint1.position, b: joint2.position});

        this.upLeftJoint = ViewFactory.CreateJoint(newPos);
        grabWall.Split(this.upLeftJoint);
      } else {
        this.upLeftJoint = ViewFactory.CreateJoint(pos);
      }

      this.upRightJoint = ViewFactory.CreateJoint(pos);
      this.downLeftJoint = ViewFactory.CreateJoint(pos);
      this.downRightJoint = ViewFactory.CreateJoint(pos);
      this.allJoints = [
        this.upRightJoint, this.upLeftJoint, this.downLeftJoint,
        this.downRightJoint
      ];

      this.upWall = ViewFactory.CreateWall(this.upLeftJoint, this.upRightJoint);
      this.downWall =
          ViewFactory.CreateWall(this.downLeftJoint, this.downRightJoint);
      this.leftWall =
          ViewFactory.CreateWall(this.upLeftJoint, this.downLeftJoint);
      this.rightWall =
          ViewFactory.CreateWall(this.upRightJoint, this.downRightJoint);
      this.allWalls =
          [this.upWall, this.downWall, this.leftWall, this.rightWall];
    } else {
      this.TryGrab(this.upRightJoint);
      this.TryGrab(this.downLeftJoint);
      this.TryGrab(this.downRightJoint);
      ChangeToSelectionMode();
    }
  }

  /**
   * walls & joints try to grab the 'pos'
   * return the position after grab.
   */
  private CalcGrabPosition(pos: Point): Point {
    const grabJoint =
        ViewFactory.GetNearestJoint(pos, this.allJoints, GRAB_JOINT_DISTANCE);
    const grabWall =
        ViewFactory.GetNearestWall(pos, this.allWalls, GRAB_WALL_DISTANCE);
    if (grabJoint) {
      pos = grabJoint.position;
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      pos = GetClosestPointOnSegment2Point(
          pos, {a: joint1.position, b: joint2.position});
    }
    return pos;
  }

  /**
   * walls & joints try to grab the joint.
   */
  private TryGrab(joint: Joint): void {
    const pos = joint.position;
    const grabJoint =
        ViewFactory.GetNearestJoint(pos, this.allJoints, GRAB_JOINT_DISTANCE);
    const grabWall =
        ViewFactory.GetNearestWall(pos, this.allWalls, GRAB_WALL_DISTANCE);
    if (grabJoint) {
      joint.Merge(grabJoint);
    } else if (grabWall) {
      const joint1 = ViewFactory.GetViewObject(grabWall.jointIDs[0]) as Joint;
      const joint2 = ViewFactory.GetViewObject(grabWall.jointIDs[1]) as Joint;

      const newPos = GetClosestPointOnSegment2Point(
          pos, {a: joint1.position, b: joint2.position});
      joint.SetPosition(newPos);
      grabWall.Split(joint);
    }
  }
}