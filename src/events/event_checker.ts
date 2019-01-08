export class Event {
  type: Type = Type.KEY_PRESS_ANY;
}

export enum Type {
  // START
  KEY_PRESS_START = 1,
  KEY_PRESS_ANY = 1,
  KEY_PRESS_TOTAL = 1000,
  // END

  // START
  MOUSE_START = 1001,
  MOUSE_TOTAL = 2000
  // END
}

/*******
 * All Key Press Event Checker
 */
type KeyPressChecker = (e: KeyboardEvent) => Event;
export let keyPressCheckersMap: {[type: number]: KeyPressChecker;} = {
  [Type.KEY_PRESS_ANY]: CheckKeyPressAny,
};

function CheckKeyPressAny(e: KeyboardEvent): Event {
  const event = new Event();
  event.type = Type.KEY_PRESS_ANY;
  return event;
}
