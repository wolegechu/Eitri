import {ViewCanvas} from '../../../view_elements/canvas';
import {StateMachine} from '../../state_machine';

export class SelectionMachine extends StateMachine {
  protected transisionTable: [];

  constructor() {
    super();
    console.debug('Enter Seletion Mode ');
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(true);
  }

  Exit(): void {
    const canvas = ViewCanvas.GetInstance();
    canvas.SetAllSelectable(false);
  }
}