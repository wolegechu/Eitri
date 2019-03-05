import {Joint} from '../view/canvas_components/joint';
import {Pedestal} from '../view/canvas_components/pedestal';
import {Room} from '../view/canvas_components/room';
import {ViewFactory} from '../view/view_factory';


export function Fill() {
  const pedestlas = ViewFactory.GetViewObjectsWithType<Pedestal>(Pedestal);
  pedestlas.forEach(p => {
    let px: number, py: number;
    let pRotation: number;
    let pWidth: number, pHeight: number;
    let pFlip: boolean;

    // map Pedestlas data to fabricJS data
    pRotation = (p.rotation % 360 + 360) % 360;
    if (Math.abs(pRotation - 0) < 1e-8) {
      pWidth = p.width;
      pHeight = p.height;
      pFlip = p.flip;
      px = p.x;
      py = p.y;
    } else if (Math.abs(pRotation - 90) < 1e-8) {
      pWidth = p.height;
      pHeight = p.width;
      pFlip = p.flip;
      px = p.x + p.width;
      py = p.y;
    } else if (Math.abs(pRotation - 180) < 1e-8) {
      pWidth = p.width;
      pHeight = p.height;
      pFlip = p.flip;
      px = p.x + p.width;
      py = p.y + p.height;
    } else if (Math.abs(pRotation - 270) < 1e-8) {
      pWidth = p.height;
      pHeight = p.width;
      pFlip = p.flip;
      px = p.x;
      py = p.y + p.height;
    }

    ViewFactory.CreateFurnitureGroup({
      position: {x: px, y: py},
      rotation: pRotation,
      aWidth: pWidth,
      bHeight: pHeight,
      flip: pFlip,
      furnitures: [
        {
          imgHandle: 'bed',
          x: '0',
          y: 'b-h',
          w: 'a-10',
          h: 'b/3',
          r: 0,
          p: false
        },
        {
          imgHandle: 'door',
          x: '50',
          y: '50',
          w: '50',
          h: '50',
          r: 0,
          p: false
        }
      ]
    });
  });
}


/**
 * Generate Pedestals Automaticly
 */
export function GeneratePedestals() {
  const rooms = ViewFactory.GetViewObjectsWithType(Room);
  const result: Pedestal[] = [];
  rooms.forEach(room => {
    let left = 1e8, top = 1e8, right = -1e8, bottom = -1e8;
    room.jointIDs.forEach(id => {
      const joint = ViewFactory.GetViewObject(id) as Joint;
      const p = joint.position;
      if (p.x < left) {
        left = p.x;
      }
      if (p.x > right) {
        right = p.x;
      }
      if (p.y < top) {
        top = p.y;
      }
      if (p.y > bottom) {
        bottom = p.y;
      }
    });
    const pedestal = ViewFactory.CreatePedestal();
    Object.assign(pedestal, {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
      rotation: 0,
      flip: false
    });
  });
}