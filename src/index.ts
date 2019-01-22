import {RegistCanvasEvent} from './events/event_system';
import {DrawRectangleMachine} from './state_machine/designer/draw_rectangle/draw_rectangle_machine';
import {WallDrawingMachine} from './state_machine/designer/draw_wall/draw_wall_machine';
import {DrawWindowMachine} from './state_machine/designer/draw_window/draw_window_machine';
import {GenerateRoomMachine} from './state_machine/designer/generate_room/generate_room_machine';
import {SelectionMachine} from './state_machine/designer/selection/selection_machine';
import {StateMachine} from './state_machine/state_machine';
import {ViewCanvas} from './view/drawing_board/canvas';
import {RoomType} from './view/drawing_board/room';
import * as ViewFactory from './view/drawing_board/view_factory';
import {PROPERTY_TYPE_ROOM_TYPE, PROPERTY_TYPE_WALL_TYPE} from './view/drawing_board/view_object';
import {WallType} from './view/drawing_board/wall';

let machine: StateMachine = null;


function Init(option: {canvasID: string}) {
  ViewCanvas.GetInstance().Init(option.canvasID);
  machine = new WallDrawingMachine();

  RegistCanvasEvent();
}

/**
 * get the array of select options (such as ["普通墙", "承重墙"])
 * @param type the type of options (such as "wall_type", "room_type")
 */
function GetOptions(type: string): string[] {
  if (type === PROPERTY_TYPE_ROOM_TYPE) {
    return [
      RoomType.Bedroom, RoomType.Kitchen, RoomType.LivingRoom, RoomType.Toilet
    ];
  } else if (type === PROPERTY_TYPE_WALL_TYPE) {
    return [WallType.NORMAL, WallType.MAIN];
  }
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

export {
  UploadBackground,
  ChangeToSelectionMode,
  GenerateRoom,
  DrawWindow,
  DrawRectangle,
  DrawWall,
  GetOptions,
  Init
};

import './test';