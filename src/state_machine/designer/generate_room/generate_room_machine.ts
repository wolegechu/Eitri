import Flatten from 'flatten-js';

import {Joint} from '../../../view/canvas_components/joint';
import {Room} from '../../../view/canvas_components/room';
import {Wall} from '../../../view/canvas_components/wall';
import {ViewFactory} from '../../../view/view_factory';


export class RoomGenerator {
  static Generate() {
    ViewFactory.GetViewObjectsWithType(Room).forEach(room => {
      room.RemoveSelf();
    });

    this.GenerateRooms();
  }

  private static GenerateRooms() {
    ViewFactory.GetViewObjectsWithType(Joint).forEach(v => {
      this.Dfs(v, [v], []);
    });
  }

  /**
   * this is the algorithm.
   * you don't need to know the detail.
   * and don't call it elsewhere.
   */
  private static Dfs(v: Joint, vertexes: Joint[], edges: Wall[]) {
    for (const wall of v.walls) {
      if (wall === edges[edges.length - 1]) continue;
      const v2 = v === wall.joint1 ? wall.joint2 : wall.joint1;

      if (v2 === vertexes[0]) {
        // finish
        edges.push(wall);
        vertexes.push(v2);
        if (this.CheckRoomLegal(vertexes, edges)) {
          // generate room
          ViewFactory.CreateRoom(vertexes.slice(0, vertexes.length - 1));
        }
        edges.pop();
        vertexes.pop();
      } else if (vertexes.indexOf(v2) !== -1) {
        // wrong path
        return;
      } else {
        // continue finding
        edges.push(wall);
        vertexes.push(v2);
        this.Dfs(v2, vertexes, edges);
        edges.pop();
        vertexes.pop();
      }
    }
  }

  private static CheckRoomLegal(vertexes: Joint[], edges: Wall[]): boolean {
    // the first vertex position test
    const pivotPos = vertexes[0].position;  // the first vertex
    for (const vert of vertexes) {
      if (vert.position.x < pivotPos.x ||
          (vert.position.x === pivotPos.x && vert.position.y < pivotPos.y)) {
        return false;
      }
    }

    // the big-small test
    if (vertexes[1].id > vertexes[vertexes.length - 2].id) {
      return false;
    }

    // is room test
    if (this.IsRoom(vertexes.slice(0, -1), edges)) {
      return true;
    } else {
      return false;
    }
  }

  private static IsRoom(vertexes: Joint[], edges: Wall[]): boolean {
    const verts = new Array<Flatten.Point>();
    for (const vert of vertexes) {
      verts.push(new Flatten.Point(vert.position.x, vert.position.y));
    }


    const polygon = new Flatten.Polygon();
    polygon.addFace(verts);

    for (const wall of ViewFactory.GetViewObjectsWithType(Wall)) {
      if (edges.indexOf(wall) !== -1) continue;
      const joint1 = wall.joint1;
      const joint2 = wall.joint2;
      let p1 = new Flatten.Point(joint1.position.x, joint1.position.y);
      let p2 = new Flatten.Point(joint2.position.x, joint2.position.y);
      let vec = new Flatten.Vector(p1, p2);
      vec = vec.normalize();
      p1 = p1.translate(vec.multiply(1e-3));
      p2 = p2.translate(vec.multiply(-1e-3));
      if (polygon.contains(p1)) return false;
      if (polygon.contains(p2)) return false;
    }
    return true;
  }
}