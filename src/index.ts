import {DrawRectangleMachine} from './state_machine/designer/draw_rectangle/draw_rectangle_machine';
import {WallDrawingMachine} from './state_machine/designer/draw_wall/draw_wall_machine';
import {SelectionMachine} from './state_machine/designer/selection/selection_machine';
import {StateMachine} from './state_machine/state_machine';

let machine: StateMachine = new SelectionMachine();

const buttonDrawWall = document.getElementById('draw_wall');
const buttonDrawRectangle = document.getElementById('draw_rectangle');

buttonDrawWall.onclick = (e) => {
  machine.Exit();
  machine = new WallDrawingMachine();
};

buttonDrawRectangle.onclick = (e) => {
  machine.Exit();
  machine = new DrawRectangleMachine();
};

export function ChangeToSelectionMode(): void {
  machine.Exit();
  machine = new SelectionMachine();
}