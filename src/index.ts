import {RegistCanvasEvent} from './events/event_system';
import {DrawRectangleMachine} from './state_machine/designer/draw_rectangle/draw_rectangle_machine';
import {WallDrawingMachine} from './state_machine/designer/draw_wall/draw_wall_machine';
import {DrawWindowMachine} from './state_machine/designer/draw_window/draw_window_machine';
import {GenerateRoomMachine} from './state_machine/designer/generate_room/generate_room_machine';
import {SelectionMachine} from './state_machine/designer/selection/selection_machine';
import {StateMachine} from './state_machine/state_machine';
import {ViewCanvas} from './view/drawing_board/canvas';
import * as ViewFactory from './view/drawing_board/view_factory';

let machine: StateMachine = null;


function Init(option: {canvasID: string}) {
  ViewCanvas.GetInstance().Init(option.canvasID);
  machine = new WallDrawingMachine();

  RegistCanvasEvent();
}

function DrawWall() {
  machine.Exit();
  machine = new WallDrawingMachine();
}

function DrawRectangle() {
  machine.Exit();
  machine = new DrawRectangleMachine();
}

function DrawWindow() {
  machine.Exit();
  machine = new DrawWindowMachine();
}

function GenerateRoom() {
  machine.Exit();
  machine = new GenerateRoomMachine();
}

function ChangeToSelectionMode() {
  machine.Exit();
  machine = new SelectionMachine();
}

function UploadBackground(file: Blob) {
  const reader = new FileReader();
  reader.onload = event => {
    const imgObj = new Image();
    imgObj.src = (event.target as FileReader).result as string;

    imgObj.onload = () => {
      ViewFactory.CreateBackground(imgObj);
    };
  };
  reader.readAsDataURL(file);
}

function DownloadJson() {
  const element = document.createElement('a');

  const blob = new Blob([ViewFactory.ExportToJson()]);
  element.download = 'a.json';

  element.href = URL.createObjectURL(blob);

  element.click();
  element.remove();
}

function ImportJson(file: Blob) {
  const reader = new FileReader();
  reader.onload = event => {
    ViewFactory.ImportFromJson((event.target as FileReader).result as string);
  };

  reader.readAsText(file);
}

function DownloadSVG() {
  const element = document.createElement('a');

  const blob = new Blob([ViewCanvas.GetInstance().ToSVG()]);
  element.download = 'a.svg';

  element.href = URL.createObjectURL(blob);

  element.click();
  element.remove();
}

export {
  DownloadSVG,
  ImportJson,
  DownloadJson,
  UploadBackground,
  ChangeToSelectionMode,
  GenerateRoom,
  DrawWindow,
  DrawRectangle,
  DrawWall,
  Init
};

import './test';