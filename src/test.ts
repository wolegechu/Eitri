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
  // TestAccessory();
  // TestJoint();
  // TestRoom();
  TestWall();
};

/**
 * try to export and import Wall
 */
function TestWall() {
  const a = ViewFactory.GetViewObjectsWithType<Wall>(Wall)[0];
  const json = a.ToJson();
  a.RemoveSelf();
  setTimeout(() => {
    console.log('begin');
    console.log(json);
    const data = JSON.parse(json);
    const b = new Wall(data.id, data);
    b.UpdateView();
  }, 1000);
}


/**
 * try to export and import Room
 */
function TestRoom() {
  const a = ViewFactory.GetViewObjectsWithType<Room>(Room)[0];
  const json = a.ToJson();
  a.RemoveSelf();
  setTimeout(() => {
    console.log('begin');
    console.log(json);
    const data = JSON.parse(json);
    const b = new Room(data.id, data);
    b.UpdateView();
  }, 1000);
}

/**
 * try to export and import Joint
 */
function TestJoint() {
  const a = ViewFactory.GetViewObjectsWithType<Joint>(Joint)[0];
  const json = a.ToJson();
  a.RemoveSelf();
  setTimeout(() => {
    console.log('begin');
    console.log(json);
    const data = JSON.parse(json);
    const b = new Joint(data.id, data);
    ViewCanvas.GetInstance().Add(b);
    b.UpdateView();
  }, 1000);
}

/**
 * try to export and import accessory
 */
function TestAccessory() {
  const a = ViewFactory.GetViewObjectsWithType<Accessory>(Accessory)[0];
  const json = a.ToJson();
  a.RemoveSelf();
  setTimeout(() => {
    console.log('begin');
    const data = JSON.parse(json);
    const b = new Accessory(data.id, data);
    ViewCanvas.GetInstance().Add(b);
    b.UpdateView();
  }, 1000);
}