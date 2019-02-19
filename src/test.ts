import * as XLSX from 'xlsx';

import {Fill} from './furniture_filler/furniture_filler';
import * as FSS from './index';
import * as ViewFactory from './view/drawing_board/view_factory';


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
  const p1 = ViewFactory.CreatePedestal();
  Object.assign(
      p1, {x: 100, y: 200, width: 150, height: 250, rotation: 0, flip: false});

  const p2 = ViewFactory.CreatePedestal();
  Object.assign(
      p2, {x: 500, y: 200, width: 150, height: 250, rotation: 0, flip: true});
  Fill();


  // const file = require('./images/test.xlsx');
  // const workbook = XLSX.read(file, { type: "base64" });
  // console.log(workbook);
};
