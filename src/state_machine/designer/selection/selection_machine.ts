import {ViewCanvas} from '../../../view_elements/canvas';
import {StateMachine} from '../../state_machine';
import * as EventSystem from '../../../events/index';

export class SelectionMachine extends StateMachine {
  protected transisionTable: [];

  private funcOnObjectSelect = (e: EventSystem.FssEvent) => {
    this.OnObjectSelect(e);
  }

  constructor() {
    super();
    console.debug('Enter Seletion Mode ');
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(true);

    EventSystem.AddEventListener(EventSystem.EventType.OBJECT_SELECT, this.funcOnObjectSelect);
  }

  Exit(): void {
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(false);
  }

  private OnObjectSelect(event: EventSystem.FssEvent): void {
    event.target
  }
}