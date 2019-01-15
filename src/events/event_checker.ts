import {Point} from '../utils/index';
import {ViewObject} from '../view/drawing_board/view_object';

export class FssEvent {
  type: EventType;
  target: ViewObject;
  position: Point;
}

export enum EventType {
  // START
  KEY_PRESS_START = 1,
  KEY_PRESS_ANY,
  KEY_PRESS_ENTER,
  KEY_PRESS_TOTAL = 1000,
  // END

  // START
  MOUSE_START = 1001,
  MOUSE_CLICK_CANVAS,
  MOUSE_MOVE_CANVAS,
  MOUSE_TOTAL = 2000,
  // END

  OBJECT_START = 3001,
  OBJECT_SELECT,
  OBJECT_TOTAL = 4000,
}

/*******
 * All Key Press Event Checker
 */
type KeyPressChecker = (e: KeyboardEvent) => FssEvent;
export let keyPressCheckersMap = new Map<EventType, KeyPressChecker>([
  [EventType.KEY_PRESS_ANY, CheckKeyPressAny],
  [EventType.KEY_PRESS_ENTER, CheckKeyPressEnter],
]);

function CheckKeyPressAny(e: KeyboardEvent): FssEvent {
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_ANY;
  return event;
}

function CheckKeyPressEnter(e: KeyboardEvent): FssEvent {
  if ('Enter' !== e.code) return;
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_ENTER;
  return event;
}
