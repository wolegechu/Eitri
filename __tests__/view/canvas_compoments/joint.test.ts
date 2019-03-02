// tslint:disable-next-line:variable-name
const RemoveObject = jest.fn((obj: ViewObject) => {});

let joint1: Joint, joint5: Joint, joint6: Joint, joint7: Joint;
let wall2: Wall, wall3: Wall, wall4: Wall;
function Init() {
  RemoveObject.mockClear();
  joint1 = new Joint(1, {_wallIDs: [2, 3, 4], _position: {x: 1, y: 2}});
  joint5 = new Joint(5, {_wallIDs: [2, 4, 100], _position: {x: 1, y: 2}});
  joint6 = new Joint(6, {_wallIDs: [2], _position: {x: 1, y: 2}});
  joint7 = new Joint(7, {_wallIDs: [2], _position: {x: 1, y: 2}});
  wall2 = new Wall(2, {_jointIDs: [1, 7]});
  wall3 = new Wall(3, {});
  wall4 = new Wall(4, {});
}

jest.mock('../../../src/view/canvas_components/canvas_manager');

let funcGetObj: (id: number) =>
    ViewObject;  // used to mock function GetViewObject
jest.mock('../../../src/view/canvas_components/view_factory', () => {
  function GetViewObject(id: number): ViewObject {
    return funcGetObj(id);
  }

  return {GetViewObject, RemoveObject};
});


import {Joint, JointOption} from '../../../src/view/canvas_components/joint';
import {ViewObject} from '../../../src/view/canvas_components/view_object';
import * as ViewFactory from '../../../src/view/canvas_components/view_factory';
import {Wall} from '../../../src/view/canvas_components/wall';
import {Point} from '../../../src/utils';


describe('Joint', () => {
  test('position', () => {
    // init
    const joint1 = new Joint(1, {_wallIDs: [2, 3, 4], _position: {x: 1, y: 2}});
    const map: {[key: number]: ViewObject} = {1: joint1};
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint = ViewFactory.GetViewObject(1) as Joint;
    expect(joint.position.x).toBeCloseTo(1);
    expect(joint.position.y).toBeCloseTo(2);
  });

  test('walls', () => {
    // init
    const joint1 =
        new Joint(1, {_wallIDs: [2, 3, -1], _position: {x: 1, y: 2}});
    const map: {[key: number]: ViewObject} = {
      1: joint1,
      2: new Wall(2, {}),
      3: new Wall(3, {}),
    };
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint = ViewFactory.GetViewObject(1) as Joint;
    const walls = joint.walls;
    const ids = walls.map(o => o.id);
    expect(walls.length).toBe(2);
    expect(ids.indexOf(2)).not.toBe(-1);
    expect(ids.indexOf(3)).not.toBe(-1);
  });

  test('to json', () => {
    // init
    const joint1 = new Joint(1, {_wallIDs: [2, 3, 4], _position: {x: 1, y: 2}});
    const map: {[key: number]: ViewObject} = {
      1: joint1,
    };
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint = ViewFactory.GetViewObject(1) as Joint;
    const json = joint.ToJson() as JointOption;
    expect(json.id).toBe(1);
    expect(json._position.x).toBeCloseTo(1);
    expect(json._position.y).toBeCloseTo(2);
    expect(json._wallIDs.length).toBe(3);
    expect(json._wallIDs.indexOf(2)).not.toBe(-1);
    expect(json._wallIDs.indexOf(3)).not.toBe(-1);
    expect(json._wallIDs.indexOf(4)).not.toBe(-1);
  });

  test('remove wall ID correct operation', () => {
    // init
    RemoveObject.mockClear();
    const joint1 = new Joint(1, {_wallIDs: [2], _position: {x: 1, y: 2}});
    const map: {[key: number]: ViewObject} = {1: joint1, 2: new Wall(2, {})};
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint = ViewFactory.GetViewObject(1) as Joint;
    joint.RemoveWallID(2);
    expect(joint.walls.length).toBe(0);
    expect(RemoveObject).toBeCalledWith(joint);
  });

  test('remove wall ID 2 incorrect operation', () => {
    // init
    RemoveObject.mockClear();
    const joint1 = new Joint(1, {_wallIDs: [2, 3], _position: {x: 1, y: 2}});
    const map:
        {[key: number]:
             ViewObject} = {1: joint1, 2: new Wall(2, {}), 3: new Wall(3, {})};
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint = ViewFactory.GetViewObject(1) as Joint;
    joint.RemoveWallID(3);
    expect(joint.walls.length).toBe(1);
    expect(RemoveObject).not.toBeCalled();
  });

  test('set position', () => {
    // init
    RemoveObject.mockClear();
    const joint1 = new Joint(1, {_wallIDs: [], _position: {x: 1, y: 2}});
    const map: {[key: number]: ViewObject} = {
      1: joint1,
    };
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint = ViewFactory.GetViewObject(1) as Joint;
    joint.SetPosition(new Point(5, 6));
    expect(joint.position.x).toBeCloseTo(5);
    expect(joint.position.y).toBeCloseTo(6);
  });

  test('merge', () => {
    // init
    RemoveObject.mockClear();
    const j1 = new Joint(1, {_wallIDs: [3, 4], _position: {x: 1, y: 2}});
    const j2 = new Joint(2, {_wallIDs: [3, 5], _position: {x: 1, y: 2}});
    const w3 = new Wall(3, {_jointIDs: [1, 2]});
    const map: {[key: number]: ViewObject} =
        {1: j1, 2: j2, 3: w3, 4: new Wall(4, {}), 5: new Wall(5, {})};
    funcGetObj = (id) => {
      return map[id];
    };

    // test
    const joint1 = ViewFactory.GetViewObject(1) as Joint;
    const joint2 = ViewFactory.GetViewObject(2) as Joint;
    const wall3 = ViewFactory.GetViewObject(3) as Wall;
    joint1.Merge(joint2);

    const walls = joint1.walls;
    const ids = walls.map(o => o.id);
    expect(walls.length).toBe(2);
    expect(ids.indexOf(3)).toBe(-1);
    expect(ids.indexOf(4)).not.toBe(-1);
    expect(ids.indexOf(5)).not.toBe(-1);
    expect(RemoveObject).toBeCalledWith(wall3);
  });
});
