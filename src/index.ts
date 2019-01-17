import {fabric} from 'fabric';

import {DrawRectangleMachine} from './state_machine/designer/draw_rectangle/draw_rectangle_machine';
import {WallDrawingMachine} from './state_machine/designer/draw_wall/draw_wall_machine';
import {SelectionMachine} from './state_machine/designer/selection/selection_machine';
import {StateMachine} from './state_machine/state_machine';
import {ViewCanvas} from './view/drawing_board/canvas';

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

// button load a image to full screen
document.getElementById('imgLoader').onchange = (e) => {
  const reader = new FileReader();
  reader.onload = event => {
    const imgObj = new Image();
    imgObj.src = (event.target as FileReader).result as string;

    imgObj.onload = () => {
      ViewCanvas.GetInstance().AddImage(imgObj);
    };
  };
  reader.readAsDataURL((e.srcElement as HTMLInputElement).files[0]);
};