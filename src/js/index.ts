import 'bootstrap';
import 'fabric';
import '../scss/index.scss';

enum Tool {
  Selection,
  Line,
}

let T:Tool = Tool.Line; // the used tool at present
let drawingLine:boolean = false

$(document).keyup(function(e) {
  if (e.keyCode == 27) { // key ESC
    T = Tool.Selection;
    canvas.remove(line);
  }
});

$('#line').on('click', function(){
  T = Tool.Line;
});

var canvas = new fabric.Canvas('c');
var line;

function makeCircle(point, radius=12) {
  var c = new fabric.Circle({
    left: point.x - radius,
    top: point.y - radius,
    strokeWidth: 5,
    radius: radius,
    fill: '#fff',
    stroke: '#666',
  });
  c.hasControls = false;
  return c;
}

function makeLine(points) {
  var l = new fabric.Line(points, {
    strokeWidth: 3,
    stroke: 'red',
    selectable: false,
    evented: false
  });
  l.line_1 = null;
  l.line_2 = null;
  return l;
}

canvas.on('mouse:down', function(o) {
  if(T == Tool.Selection) return;
  var point = canvas.getPointer(o.e);
  var circle = makeCircle(point);
  var points = [point.x, point.y, point.x, point.y];

  circle.line_2 = line; // last line
  line = makeLine(points);
  circle.line_1 = line; // present line

  if(!drawingLine) {
    drawingLine = true;
  }
  
  canvas.add(circle);
  canvas.add(line);
});

canvas.on('mouse:move', function(o) {
  if (drawingLine) {
    var pointer = canvas.getPointer(o.e);
    console.log(pointer.x)
    line.set({x2: pointer.x, y2: pointer.y});
    canvas.renderAll();
  }
});

canvas.on('object:moving', function(e) {
  var p = e.target;
  p.line_1 && p.line_1.set({'x1': p.left + p.radius, 'y1':p.top + p.radius});
  p.line_2 && p.line_2.set({'x2': p.left + p.radius, 'y2':p.top + p.radius});
  canvas.renderAll();
})

