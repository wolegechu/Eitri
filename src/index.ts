import {WallDrawingMachine} from './state_machine/designer/draw_wall/draw_wall_machine';


// import { DrawLineState } from "./state_machine/designer/draw_line/draw_line";

const a = new WallDrawingMachine();
// var machine = new StateMachine(DrawLineState.GetInstance());
// import { Canvas } from './view_elements/canvas';
// import { fabric } from 'fabric';
// import { Point } from './view_elements/joint'


// enum Tool {
//   Selection,
//   Line,
// }

// let T: Tool = Tool.Line; // the used tool at present
// let drawingLine: boolean = false
// let line: fabric.Line;

// document.onkeydown = (event: KeyboardEvent) => {
//   switch (event.keyCode) {
//     case 27:
//       T = Tool.Selection;
//       canvas.remove(line);
//       break;
//   }
// };

// document.getElementById("line").onclick = (event: MouseEvent) => {
//   T = Tool.Line;
// };

// function orderObjects(compare: Function) {
//   // this._objects.sort(compare);
//   // this.renderAll();
// }


// function compare(x: any, y: any) {
//   if (x.type == 'circle' && y.type == 'line') {
//     return true;
//   } else {
//     return false;
//   }
// }

// orderObjects(compare);

// function makeCircle(point: fabric.Point, radius = 12) {
//   var c = new fabric.Circle({
//     left: point.x - radius,
//     top: point.y - radius,
//     strokeWidth: 5,
//     radius: radius,
//     fill: '#fff',
//     stroke: '#666',
//   });
//   c.hasControls = false;
//   return c;
// }

// function makeLine(points: number[]) {
//   var l = new fabric.Line(points, {
//     strokeWidth: 3,
//     stroke: 'red',
//     selectable: false,
//     evented: false
//   });
//   // l.line_1 = null;
//   // l.line_2 = null;
//   return l;
// }

// var canvas = Canvas.getInstance().canvas;
// canvas.on('mouse:down', function (o) {
//   if (T == Tool.Selection) return;
//   var point = canvas.getPointer(o.e);
//   var circle = makeCircle(new Point(point.x, point.y));
//   var points = [point.x, point.y, point.x, point.y];

//   // circle.line_2 = line; // last line
//   line = makeLine(points);
//   // circle.line_1 = line; // present line

//   if (!drawingLine) {
//     drawingLine = true;
//   }

//   canvas.add(circle);
//   canvas.add(line);
// });

// canvas.on('mouse:move', function (o) {
//   if (drawingLine) {
//     var pointer = canvas.getPointer(o.e);
//     // console.log(pointer.x)
//     line.set({ x2: pointer.x, y2: pointer.y });
//     canvas.renderAll();
//   }
// });

// canvas.on('object:moving', function (e) {

//   var p = e.target;
//   // p.line_1 && p.line_1.set({ 'x1': p.left + p.radius, 'y1': p.top +
//   p.radius });
//   // p.line_2 && p.line_2.set({ 'x2': p.left + p.radius, 'y2': p.top +
//   p.radius });
//   // canvas.orderObjects(compare);
// })
