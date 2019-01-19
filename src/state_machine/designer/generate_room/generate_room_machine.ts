import {ChangeToSelectionMode} from '../../..';
import {PolygonIsClockWise} from '../../../utils/math';
import {Joint} from '../../../view/drawing_board/joint';
import {Room} from '../../../view/drawing_board/room';
import * as ViewFactory from '../../../view/drawing_board/view_factory';
import {GetViewObjectsWithType} from '../../../view/drawing_board/view_factory';
import {Wall} from '../../../view/drawing_board/wall';
import {StateMachine} from '../../state_machine';


export class GenerateRoomMachine extends StateMachine {
  protected transisionTable: [];

  constructor() {
    super();
    console.debug('Enter Generate Room Mode');

    ViewFactory.GetViewObjectsWithType<Room>(Room).forEach(room => {
      room.RemoveSelf();
    });

    this.GenerateRooms();
    ChangeToSelectionMode();
  }

  private GenerateRooms() {
    GetViewObjectsWithType<Joint>(Joint).forEach(v => {
      this.Dfs(v, [v], []);
    });
  }

  /**
   * this is the algorithm.
   * you don't need to know the detail.
   * and don't call it elsewhere.
   */
  private Dfs(v: Joint, vertexes: Joint[], edges: Wall[]) {
    for (const id of v.wallIDs) {
      const wall = ViewFactory.GetViewObject(id) as Wall;
      if (wall === edges[edges.length - 1]) continue;
      const v2ID = wall.jointIDs[wall.jointIDs.indexOf(v.id) ^ 1];
      const v2 = ViewFactory.GetViewObject(v2ID) as Joint;

      if (v2 === vertexes[0]) {
        // finish
        edges.push(wall);
        vertexes.push(v2);
        if (this.CheckRoomLegal(vertexes, edges)) {
          // generate room
          ViewFactory.CreateRoom(edges, vertexes[0]);
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

  private CheckRoomLegal(vertexes: Joint[], edges: Wall[]): boolean {
    // clockwise test
    if (!PolygonIsClockWise(vertexes.map(v => v.position))) return false;

    // the first vertex position test
    const pivotPos = vertexes[0].position;  // the first vertex
    for (const vert of vertexes) {
      if (vert.position.x < pivotPos.x ||
          (vert.position.x === pivotPos.x && vert.position.y < pivotPos.y)) {
        return false;
      }
    }

    // cross edge test
    const vertexIDs = vertexes.map(vert => {
      return vert.id;
    });
    for (const wall of GetViewObjectsWithType<Wall>(Wall)) {
      if (edges.indexOf(wall) !== -1) continue;
      if (vertexIDs.indexOf(wall.jointIDs[0]) !== -1 &&
          vertexIDs.indexOf(wall.jointIDs[1]) !== -1) {
        return false;
      }
    }
    return true;
  }

  Exit(): void {}
}