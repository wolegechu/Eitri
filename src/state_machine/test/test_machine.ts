import * as EventSystem from '../../events/index';
import {BaseState, StateMachine} from '../state_machine';

import {TestStateA} from './test_state';


export class TestMachine extends StateMachine {
  stateA: TestStateA = new TestStateA(this);
  stateB: TestStateA = new TestStateA(this);

  protected transisionTable = [
    {
      origin: this.stateA,
      target: this.stateB,
      event: EventSystem.EventType.KEY_PRESS_ANY
    },
    {
      origin: this.stateB,
      target: this.stateA,
      event: EventSystem.EventType.KEY_PRESS_ANY
    }
  ];

  constructor() {
    super();

    this.stateA.name = 'A';
    this.stateB.name = 'B';

    this.InitState(this.stateA);
  }

  Exit(): void {}
}