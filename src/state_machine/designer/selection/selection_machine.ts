import * as EventSystem from '../../../event_system';
import {ViewObject} from '../../../view/canvas_components/view_object';
import {CanvasManager} from '../../../view/canvas_manager';
import {UIIndex} from '../../../view/html_components/index';
import {StateMachine} from '../../state_machine';

export class SelectionMachine extends StateMachine {
  selectedObject: ViewObject;

  private funcOnObjectSelect = (e: EventSystem.FssEvent) => {
    this.OnObjectSelect(e);
  };
  private funcOnSelectClear = (e: EventSystem.FssEvent) => {
    this.OnSelectClear();
  };
  private funcOnPressDelete = (e: EventSystem.FssEvent) => {
    this.OnPressDelete();
  };

  constructor() {
    super();
    console.debug('Enter Seletion Mode ');
    CanvasManager.SetAllSelectable(true);
    EventSystem.AddEventListener(
        EventSystem.EventType.OBJECT_SELECT_CLEAR, this.funcOnSelectClear);
    EventSystem.AddEventListener(
        EventSystem.EventType.OBJECT_SELECT, this.funcOnObjectSelect);
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_BACKSPACE, this.funcOnPressDelete);
  }

  Exit(): void {
    CanvasManager.SetAllSelectable(false);
    console.debug('Leave Seletion Mode ');
    if (this.selectedObject && this.selectedObject.OnUnSelect) {
      this.selectedObject.OnUnSelect();
    }

    EventSystem.RemoveEventListener(
        EventSystem.EventType.OBJECT_SELECT, this.funcOnObjectSelect);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_BACKSPACE, this.funcOnPressDelete);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.OBJECT_SELECT_CLEAR, this.funcOnSelectClear);
  }

  private OnObjectSelect(event: EventSystem.FssEvent): void {
    const target = event.target;
    console.debug(target);

    if (!target.ExportProperties) return;
    if (this.selectedObject && this.selectedObject.OnUnSelect) {
      this.selectedObject.OnUnSelect();
    }
    if (target.OnSelect) target.OnSelect();
    this.selectedObject = target;
    UIIndex(target);
  }

  private OnSelectClear(): void {
    console.debug('select clear');

    if (this.selectedObject && this.selectedObject.OnUnSelect) {
      this.selectedObject.OnUnSelect();
    }
  }

  private OnPressDelete(): void {
    if (this.selectedObject) {
      this.selectedObject.RemoveSelf();
      this.selectedObject = null;
    }
  }
}