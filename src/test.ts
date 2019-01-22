import * as FSS from './index';

console.log('test solution');
FSS.Init({canvasID: 'c'});

const buttonDrawWall = document.getElementById('draw_wall');
const buttonDrawRectangle = document.getElementById('draw_rectangle');
const buttonDrawWindow = document.getElementById('draw_window');
const buttonGenerateRoom = document.getElementById('generate_room');
const imageLoader = document.getElementById('imgLoader')

buttonDrawWall.onclick = FSS.DrawWall;
buttonDrawRectangle.onclick = FSS.DrawRectangle;
buttonDrawWindow.onclick = FSS.DrawWindow;
buttonGenerateRoom.onclick = FSS.GenerateRoom;
imageLoader.onchange = (e) => {
    const file = (e.srcElement as HTMLInputElement).files[0];
    FSS.UploadBackground(file);
};