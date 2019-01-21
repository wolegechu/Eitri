import {Wall} from '../../view/drawing_board/wall';
import {ViewObject} from '../drawing_board/view_object';
import {callJsFunc} from './test';

export function UIIndex(viewObject: ViewObject): void {
  const propertiesDict = viewObject.ExportProperties();
  callJsFunc(viewObject);

  // const keysDict = keys<propertiesDict>();
}
