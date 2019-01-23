import * as EventSystem from '../../../events/index';
import {UIIndex} from '../../../view/components/index';
import {Accessory} from '../../../view/drawing_board/accessory';
import {ViewCanvas} from '../../../view/drawing_board/canvas';
import {Joint} from '../../../view/drawing_board/joint';
import {ViewObject} from '../../../view/drawing_board/view_object';
import {StateMachine} from '../../state_machine';

export class SelectionMachine extends StateMachine {
  selectedObject: ViewObject;
  protected transisionTable: [];

  private funcOnObjectSelect =
      (e: EventSystem.FssEvent) => {
        this.OnObjectSelect(e);
      }

  private funcOnPressDelete =
      (e: EventSystem.FssEvent) => {
        this.OnPressDelete(e);
      }

  constructor() {
    super();
    console.debug('Enter Seletion Mode ');
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(true);
    EventSystem.AddEventListener(
        EventSystem.EventType.OBJECT_SELECT, this.funcOnObjectSelect);
    EventSystem.AddEventListener(
        EventSystem.EventType.KEY_PRESS_BACKSPACE, this.funcOnPressDelete);
  }

  Exit(): void {
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(false);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.OBJECT_SELECT, this.funcOnObjectSelect);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_BACKSPACE, this.funcOnPressDelete);
  }

  private OnObjectSelect(event: EventSystem.FssEvent): void {
    const target = event.target;
    console.debug(target);

    // filter
    if (target instanceof Joint) return;
    this.selectedObject = target;
    UIIndex(target);
  }

  private OnPressDelete(event: EventSystem.FssEvent): void {
    if (this.selectedObject) {
      this.selectedObject.RemoveSelf();
      this.selectedObject = null;
    }
  }
}