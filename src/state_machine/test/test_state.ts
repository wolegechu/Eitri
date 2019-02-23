import * as EventSystem from '../../event_system';
import {BaseState} from '../state_machine';

export class TestStateA extends BaseState {
  name: string;

  // must do like this !
  // in javascript we can use keyword 'that' to avoid 'this' problem.
  // in typescript we should use 'arrow function'.
  private funcOnPressAny = (e: EventSystem.FssEvent) => {
    this.OnPressAny(e);
  };

  Enter(): void {
    console.log('Test State ' + this.name + ': Enter');

    // listen
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_ANY, this.funcOnPressAny);
  }

  Leave(): void {
    console.log('Test State ' + this.name + ': Leave');

    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ANY, this.funcOnPressAny);
  }

  private OnPressAny(event: EventSystem.FssEvent): void {
    this.machine.Transition(event.type);
  }
}
