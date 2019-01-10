import {ViewCanvas} from '../view_elements/canvas';

import {FssEvent, keyPressCheckersMap, EventType} from './event_checker';


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

function GetObservers(type: EventType): Observer[] {
  const observers = observersMap.get(type);
  if (!observers || !observers.length) return null;
  return observers;
}
