import {TestMachine} from '../../src/state_machine/test/test_machine';
import {TestStateA, TestStateB} from '../../src/state_machine/test/test_state';


test('state machine', () => {
  const machine = new TestMachine();
  expect(machine.GetState() instanceof TestStateA).toBeTruthy();

  const event = document.createEvent('KeyboardEvent');
  event.initEvent('keydown');
  document.dispatchEvent(event);

  expect(machine.GetState() instanceof TestStateB).toBeTruthy();
});