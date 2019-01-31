import * as XLSX from 'xlsx';

import {ImageHandle} from './ImageManager';
import * as FSS from './index';
import {Accessory} from './view/drawing_board/accessory';
import {ViewCanvas} from './view/drawing_board/canvas';
import {Group} from './view/drawing_board/group';
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
  const group = new Group(1001, {
    position: {x: 100, y: 100},
    rotation: 90,
    aWidth: 100,
    bHeight: 100,
    flip: true,
    furnitures: [
      {
        imgHandle: ImageHandle[ImageHandle.BED],
        x: '0',
        y: '0',
        w: '50',
        h: '50',
        r: 0,
        p: false
      },
      {
        imgHandle: ImageHandle[ImageHandle.DOOR],
        x: '50',
        y: '50',
        w: '50',
        h: '50',
        r: 0,
        p: false
      }
    ]
  });

  ViewCanvas.GetInstance().Add(group);

  // const file = require('./images/test.xlsx');
  // const workbook = XLSX.read(file, { type: "base64" });
  // console.log(workbook);
};
