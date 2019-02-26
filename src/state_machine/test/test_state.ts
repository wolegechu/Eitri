import * as EventSystem from '../../event_system';
import {BaseState} from '../state_machine';

export class TestStateA extends BaseState {
  name = 'TestState A';

  protected eventTable = [{
    event: EventSystem.EventType.KEY_PRESS_ANY,
    func: (e: EventSystem.FssEvent) => this.OnPressAny(e)
  }];

  Enter(): void {
    super.Enter();
    console.log(this.name + ': Enter');
  }

  Leave(): void {
    super.Leave();
    console.log(this.name + ': Leave');
  }

  private OnPressAny(event: EventSystem.FssEvent): void {
    this.machine.Transition(new TestStateB(this.machine));
  }
}

export class TestStateB extends BaseState {
  name = 'TestState B';

  protected eventTable = [{
    event: EventSystem.EventType.KEY_PRESS_ANY,
    func: (e: EventSystem.FssEvent) => this.OnPressAny(e)
  }];

  Enter(): void {
    super.Enter();
    console.log(this.name + ': Enter');
  }

  Leave(): void {
    super.Leave();
    console.log(this.name + ': Leave');
  }

  private OnPressAny(event: EventSystem.FssEvent): void {
    this.machine.Transition(new TestStateA(this.machine));
  }
}