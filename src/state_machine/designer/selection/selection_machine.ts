import * as EventSystem from '../../../events/index';
import {UIIndex} from '../../../view/components/index';
import {ViewCanvas} from '../../../view/drawing_board/canvas';
import {Wall} from '../../../view/drawing_board/wall';
import {StateMachine} from '../../state_machine';

export class SelectionMachine extends StateMachine {
  protected transisionTable: [];

  private funcOnObjectSelect =
      (e: EventSystem.FssEvent) => {
        this.OnObjectSelect(e);
      }

  constructor() {
    super();
    console.debug('Enter Seletion Mode ');
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(true);
    EventSystem.AddEventListener(
        EventSystem.EventType.OBJECT_SELECT, this.funcOnObjectSelect);
  }

  Exit(): void {
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(false);
  }


  private OnObjectSelect(event: EventSystem.FssEvent): void {
    const target = event.target;
    // Pass the target to UI view
    UIIndex(target);
  }
}