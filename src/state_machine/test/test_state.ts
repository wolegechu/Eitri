import * as FssEvent from '../../events/__init__';
import {BaseState} from '../state_machine';


export class TestStateA extends BaseState {
  name: string;

  // must do like this !
  // in javascript we can use keyword 'that' to avoid 'this' problem.
  // in typescript we should use 'arrow function'.
  private funcOnPressAny = (e: FssEvent.Event) => {
    this.OnPressAny(e);
  };

  Enter(): void {
    console.log('Test State ' + this.name + ': Enter');

    // listen
    FssEvent.AddEventListener(FssEvent.Type.KEY_PRESS_ANY, this.funcOnPressAny);
  }

  Leave(): void {
    console.log('Test State ' + this.name + ': Leave');

    FssEvent.RemoveEventListener(
        FssEvent.Type.KEY_PRESS_ANY, this.funcOnPressAny);
  }

  private OnPressAny(event: FssEvent.Event): void {
    this.machine.Transition(event.type);
  }
}
