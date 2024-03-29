import {StateMachine} from '../state_machine';

import {TestStateA} from './test_state';


export class TestMachine extends StateMachine {
  constructor() {
    super();
    this.InitState(new TestStateA(this));
  }

  Exit(): void {}

  GetState() {
    return this.state;
  }
}