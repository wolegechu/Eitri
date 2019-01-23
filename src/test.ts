import * as FSS from './index';
import {Accessory} from './view/drawing_board/accessory';
import {ViewCanvas} from './view/drawing_board/canvas';
import * as ViewFactory from './view/drawing_board/view_factory';

console.log('test solution');
FSS.Init({canvasID: 'c', callback: null});

const buttonDrawWall = document.getElementById('draw_wall');
const buttonDrawRectangle = document.getElementById('draw_rectangle');
const buttonDrawWindow = document.getElementById('draw_window');
const buttonGenerateRoom = document.getElementById('generate_room');
const imageLoader = document.getElementById('imgLoader');

buttonDrawWall.onclick = FSS.DrawWall;
buttonDrawRectangle.onclick = FSS.DrawRectangle;
buttonDrawWindow.onclick = FSS.DrawWindow;
buttonGenerateRoom.onclick = FSS.GenerateRoom;
imageLoader.onchange = (e) => {
  const file = (e.srcElement as HTMLInputElement).files[0];
  FSS.UploadBackground(file);
};

const buttonTest = document.getElementById('test');
buttonTest.onclick = (e) => {
  const a = ViewFactory.GetViewObjectsWithType<Accessory>(Accessory)[0];
  const json = a.ToJson();
  a.RemoveSelf();
  setTimeout(() => {
    console.log('begin');
    const data = JSON.parse(json);
    const b = new Accessory(data.id, data);
    b.UpdateView();
    ViewCanvas.GetInstance().Add(b);
  }, 2);
};