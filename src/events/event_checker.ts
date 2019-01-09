import {Point} from '../utils/index';

export class Event {
  type: Type;
  position: Point;
}

export enum Type {
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
type KeyPressChecker = (e: KeyboardEvent) => Event;
export let keyPressCheckersMap = new Map<Type, KeyPressChecker>([
  [Type.KEY_PRESS_ANY, CheckKeyPressAny],
]);

function CheckKeyPressAny(e: KeyboardEvent): Event {
  const event = new Event();
  event.type = Type.KEY_PRESS_ANY;
  return event;
}
