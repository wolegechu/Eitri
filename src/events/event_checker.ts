import {Point} from '../utils/index';

export class FssEvent {
  type: EventType;
  position: Point;
}

export enum EventType {
  // START
  KEY_PRESS_START = 1,
  KEY_PRESS_ANY,
  KEY_PRESS_TOTAL = 1000,
  // END

  // START
  MOUSE_START = 1001,
  MOUSE_CLICK_CANVAS,
  MOUSE_TOTAL = 2000
  // END
}

/*******
 * All Key Press Event Checker
 */
type KeyPressChecker = (e: KeyboardEvent) => FssEvent;
export let keyPressCheckersMap = new Map<EventType, KeyPressChecker>([
  [EventType.KEY_PRESS_ANY, CheckKeyPressAny],
]);

function CheckKeyPressAny(e: KeyboardEvent): FssEvent {
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_ANY;
  return event;
}
