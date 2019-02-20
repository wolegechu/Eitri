import {ViewCanvas} from '../view/canvas_components/canvas';

import {EventType, FssEvent, keyPressCheckersMap} from './event_checker';


type Observer = (e: FssEvent) => void;
const observersMap: Map<EventType, Observer[]> = new Map();

export function AddEventListener(event: EventType, observer: Observer) {
  let list = observersMap.get(event);
  if (!list) {
    observersMap.set(event, []);
    list = observersMap.get(event);
  }
  if (list.indexOf(observer) === -1) {
    list.push(observer);
  }
}

export function RemoveEventListener(event: EventType, observer: Observer) {
  const list = observersMap.get(event);
  if (!list) return;

  const index = list.indexOf(observer);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

export let shiftdown = false;
// Get all key press event from document
document.onkeydown = (e) => {
  console.debug('key down ' + e.code);
  if (-1 !== e.code.indexOf('Shift')) shiftdown = true;

  // check all event types if have any obsever
  keyPressCheckersMap.forEach((func, type, keyPressCheckersMap) => {
    const observers = GetObservers(type);
    if (!observers) return;

    // create the event
    const event = func(e);
    if (!event) return;

    // pass event to all observers
    observers.forEach(observer => {
      observer(event);
    });
  });
};

document.onkeyup = (e) => {
  if (-1 !== e.code.indexOf('Shift')) shiftdown = false;
};

/*****
 * Get all canvas based  event
 */
// - mouse click event
export function RegistCanvasEvent() {
  const canvas = ViewCanvas.GetInstance();
  canvas.OnMouseDown((point) => {
    const type = EventType.MOUSE_CLICK_CANVAS;

    const observers = GetObservers(type);
    if (!observers) return;

    // create the event
    const event = new FssEvent();
    event.type = type;
    event.position = point;

    // pass event to all observers
    observers.forEach(observer => {
      observer(event);
    });
  });

  // - mouse move on canvas event
  canvas.OnMouseMove((point) => {
    const type = EventType.MOUSE_MOVE_CANVAS;

    const observers = GetObservers(type);
    if (!observers) return;

    // create the event
    const event = new FssEvent();
    event.type = type;
    event.position = point;

    // pass event to all observers
    observers.forEach(observer => {
      observer(event);
    });
  });

  // - object select event
  canvas.OnObjectSelect((obj) => {
    const type = EventType.OBJECT_SELECT;

    const observers = GetObservers(type);
    if (!observers) return;

    // create the event
    const event = new FssEvent();
    event.type = type;
    event.target = obj;

    // pass event to all observers
    observers.forEach(observer => {
      observer(event);
    });
  });

  // - object select clear event
  canvas.OnSelectClear(() => {
    const type = EventType.OBJECT_SELECT_CLEAR;

    const observers = GetObservers(type);
    if (!observers) return;

    // create the event
    const event = new FssEvent();
    event.type = type;

    // pass event to all observers
    observers.forEach(observer => {
      observer(event);
    });
  });
}

function GetObservers(type: EventType): Observer[] {
  const observers = observersMap.get(type);
  if (!observers || !observers.length) return null;
  return observers;
}
