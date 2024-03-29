/**
 * `EventType` contains all kind of events we concerning.
 */

export enum EventType {
  // START
  KEY_PRESS_START = 1,
  KEY_PRESS_ANY,
  KEY_PRESS_ESC,
  KEY_PRESS_ENTER,
  KEY_PRESS_BACKSPACE,
  KEY_PRESS_NUMBER,
  KEY_PRESS_TOTAL = 1000,
  // END

  // START
  MOUSE_START = 1001,
  MOUSE_CLICK_CANVAS,
  MOUSE_MOVE_CANVAS,
  MOUSE_TOTAL = 2000,
  // END

  // START
  OBJECT_START = 3001,
  OBJECT_SELECT,
  OBJECT_SELECT_CLEAR,
  OBJECT_TOTAL = 4000,
  // END
}
