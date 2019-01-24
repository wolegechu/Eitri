import * as FSS from './index';
import {Accessory} from './view/drawing_board/accessory';
import {ViewCanvas} from './view/drawing_board/canvas';
import {Joint} from './view/drawing_board/joint';
import {Room} from './view/drawing_board/room';
import * as ViewFactory from './view/drawing_board/view_factory';
import {Wall} from './view/drawing_board/wall';

console.log('test solution');
FSS.Init({canvasID: 'c'});

const buttonDrawWall = document.getElementById('draw_wall');
const buttonDrawRectangle = document.getElementById('draw_rectangle');
const buttonDrawWindow = document.getElementById('draw_window');
const buttonGenerateRoom = document.getElementById('generate_room');
const buttonExport = document.getElementById('export');
const imageLoader = document.getElementById('imgLoader');
const jsonLoader = document.getElementById('jsonLoader');

buttonDrawWall.onclick = FSS.DrawWall;
buttonDrawRectangle.onclick = FSS.DrawRectangle;
buttonDrawWindow.onclick = FSS.DrawWindow;
buttonGenerateRoom.onclick = FSS.GenerateRoom;
buttonExport.onclick = FSS.DownloadJson;

imageLoader.onchange = (e) => {
  const file = (e.srcElement as HTMLInputElement).files[0];
  FSS.UploadBackground(file);
};

jsonLoader.onchange = (e) => {
  const file = (e.srcElement as HTMLInputElement).files[0];
  FSS.ImportJson(file);
};

const buttonTest = document.getElementById('test');
buttonTest.onclick = () => {
  // TestAccessory();
  // TestJoint();
  // TestRoom();
  // TestWall();
};
