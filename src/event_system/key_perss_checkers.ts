import {EventType, FssEvent} from '.';

/*******
 * All Key Press Event Checker
 */
type KeyPressChecker = (e: KeyboardEvent) => FssEvent;
export let keyPressCheckersMap = new Map<EventType, KeyPressChecker>([
  [EventType.KEY_PRESS_ANY, CheckKeyPressAny],
  [EventType.KEY_PRESS_ESC, CheckKeyPressEsc],
  [EventType.KEY_PRESS_BACKSPACE, CheckKeyPressBackspace],
  [EventType.KEY_PRESS_NUMBER, CheckKeyPressNumber],
  [EventType.KEY_PRESS_ENTER, CheckKeyPressEnter]
]);

function CheckKeyPressAny(e: KeyboardEvent): FssEvent {
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_ANY;
  return event;
}

function CheckKeyPressEsc(e: KeyboardEvent): FssEvent {
  if ('Escape' !== e.code) return;
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_ESC;
  return event;
}

function CheckKeyPressBackspace(e: KeyboardEvent): FssEvent {
  if ('Backspace' !== e.code) return;
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_BACKSPACE;
  return event;
}

function CheckKeyPressNumber(e: KeyboardEvent): FssEvent {
  if (-1 === e.code.indexOf('Digit')) return;
  const digit = Number(e.code.slice(5));
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_NUMBER;
  event.digitNumber = digit;
  return event;
}

function CheckKeyPressEnter(e: KeyboardEvent): FssEvent {
  if ('Enter' !== e.code) return;
  const event = new FssEvent();
  event.type = EventType.KEY_PRESS_ENTER;
  return event;
}