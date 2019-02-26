import * as EventSystem from '../../../event_system';
import {ChangeToSelectionMode} from '../../../index';
import {Joint} from '../../../view/canvas_components/joint';
import * as ViewFactory from '../../../view/canvas_components/view_factory';
import {Wall} from '../../../view/canvas_components/wall';
import {StateMachine} from '../../state_machine';
import {RectIdleState} from './draw_rectangle_state_idle';


export class DrawRectangleMachine extends StateMachine {
  upLeftJoint: Joint;
  upRightJoint: Joint;
  downLeftJoint: Joint;
  downRightJoint: Joint;
  allJoints: Joint[] = [];

  upWall: Wall;
  downWall: Wall;
  leftWall: Wall;
  rightWall: Wall;
  allWalls: Wall[] = [];

  funcOnPressESC = (e: EventSystem.FssEvent) => {
    this.OnPressESC(e);
  };

  constructor() {
    super();
    console.debug('Enter Draw Rectangle Mode');
    this.InitState(new RectIdleState(this));
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
  }

  Exit(): void {
    this.state.Leave();
    ViewFactory.Resolve();
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ESC, this.funcOnPressESC);
  }

  SetJointAndCreateWall(
    upLeftJoint: Joint,
    upRightJoint: Joint,
    downLeftJoint: Joint,
    downRightJoint: Joint) {
    this.upLeftJoint = upLeftJoint;
    this.upRightJoint = upRightJoint;
    this.downLeftJoint = downLeftJoint;
    this.downRightJoint = downRightJoint;
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
    this.allWalls = [this.upWall, this.downWall, this.leftWall, this.rightWall];
  }

  private OnPressESC(e: EventSystem.FssEvent) {
    this.allWalls.forEach(obj => {
      obj.RemoveSelf();
    });
    this.allJoints.forEach(obj => {
      obj.RemoveSelf();
    });
    ChangeToSelectionMode();
  }
}