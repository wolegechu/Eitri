/**
 * 1. class `FssEvent` is used to transmit event information.
 */

import {Point} from '../utils';
import {ViewObject} from '../view/canvas_components/view_object';

import {shiftdown} from './event_system';
import {EventType} from './event_types';

export class FssEvent {
  type: EventType;
  target: ViewObject;
  position: Point;
  shiftDown: boolean;
  digitNumber: number;
  constructor() {
    this.shiftDown = shiftdown;
  }
}