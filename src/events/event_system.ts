import {Event, keyPressCheckersMap, Type} from './event_checker';


type Observer = (e: Event) => void;
const observersMap: {[type: number]: Observer[];} = {};


export function AddEventListener(event: Type, observer: Observer) {
  let list = observersMap[event];
  if (!list) {
    observersMap[event] = [];
    list = observersMap[event];
  }
  if (list.indexOf(observer) === -1) {
    list.push(observer);
  }
}

export function RemoveEventListener(event: Type, observer: Observer) {
  const list = observersMap[event];
  if (!list) return;

  const index = list.indexOf(observer);
  if (index !== -1) {
    list.splice(index, 1);
  }
}


document.onkeypress = (e) => {
  for (const type in keyPressCheckersMap) {
    if (!observersMap[type] || !observersMap[type].length) continue;

    const event = keyPressCheckersMap[type](e);
    const observers = observersMap[type];
    observers.forEach(observer => {
      observer(event);
    });
  }
};
