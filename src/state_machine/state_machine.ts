import * as EventSystem from '../event_system';


export abstract class BaseState {
  machine: StateMachine;

  protected eventTable: Array<
      {event: EventSystem.EventType, func: (e: EventSystem.FssEvent) => void}> =
      [];

  constructor(m: StateMachine) {
    this.machine = m;
  }

  Enter(): void {
    this.eventTable.forEach(data => {
      EventSystem.AddEventListener(data.event, data.func);
    });
  }

  Leave(): void {
    this.eventTable.forEach(data => {
      EventSystem.RemoveEventListener(data.event, data.func);
    });
  }
}

export abstract class StateMachine {
  protected state: BaseState;

  constructor() {}

  abstract Exit(): void;

  Transition(newState: BaseState): void {
    this.state.Leave();
    newState.Enter();
    this.state = newState;
  }

  protected InitState(s: BaseState): void {
    s.Enter();
    this.state = s;
  }
}
