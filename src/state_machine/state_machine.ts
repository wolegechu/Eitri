import {AssertionError} from 'assert';
import * as FssEvent from '../events/__init__';


export abstract class BaseState {
  machine: StateMachine;

  constructor(m: StateMachine) {
    this.machine = m;
  }
  abstract Enter(): void;
  abstract Leave(): void;
}

type TransitionTable =
    Array<{origin: BaseState; target: BaseState; event: FssEvent.Type;}>;

export abstract class StateMachine {
  protected abstract transisionTable: TransitionTable;
  protected stateTable: {[key: string]: BaseState};
  protected state: BaseState;

  constructor() {}

  InitState(s: BaseState): void {
    s.Enter();
    this.state = s;
  }

  Transition(event: FssEvent.Type): void {
    const table = this.transisionTable;
    const result = table.filter(e => {
      return e.event === event && e.origin === this.state;
    });

    console.assert(
        result.length <= 1, 'WTF! More than one transition discovered !');
    if (result.length === 1) {
      this.state.Leave();

      const target = result[0].target;
      target.Enter();
      this.state = target;
    }
  }
}
