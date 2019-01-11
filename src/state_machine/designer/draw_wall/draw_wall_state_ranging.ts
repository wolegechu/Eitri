import * as EventSystem from '../../../events/index';
import {BaseState} from '../../state_machine';

// 输入长度
export class RangingState extends BaseState {
  name: string;

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
