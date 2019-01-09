import {Canvas} from '../view_elements/canvas';

import {Event, keyPressCheckersMap, Type} from './event_checker';


type Observer = (e: Event) => void;
const observersMap: Map<Type, Observer[]> = new Map();

export function AddEventListener(event: Type, observer: Observer) {
  let list = observersMap.get(event);
  if (!list) {
    observersMap.set(event, []);
    list = observersMap.get(event);
  }
  if (list.indexOf(observer) === -1) {
    list.push(observer);
  }
}

export function RemoveEventListener(event: Type, observer: Observer) {
  const list = observersMap.get(event);
  if (!list) return;

  const index = list.indexOf(observer);
  if (index !== -1) {
    list.splice(index, 1);
  }
}

// Get all key press event from document
document.onkeypress = (e) => {
  keyPressCheckersMap.forEach((func, type, keyPressCheckersMap) => {
    const observers = GetObservers(type);
    if (!observers) return;

    // create the event
    const event = func(e);

    // pass event to all observers
    observers.forEach(observer => {
      observer(event);
    });
  });
};

// Get all canvas click event
const canvas = Canvas.GetInstance();
canvas.SetMouseDownCallBack((point) => {
  const type = Type.MOUSE_CLICK_CANVAS;

  const observers = GetObservers(type);
  if (!observers) return;

  // create the event
  const event = new Event();
  event.type = type;
  event.position = point;

  // pass event to all observers
  observers.forEach(observer => {
    observer(event);
  });
});

function GetObservers(type: Type): Observer[] {
  const observers = observersMap.get(type);
  if (!observers || !observers.length) return null;
  return observers;
}
