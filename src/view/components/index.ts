import {Wall} from '../../view/drawing_board/wall';
import {ViewObject} from '../drawing_board/view_object';
import {callJsFunc} from './test';

export function UIIndex(viewObject: ViewObject): void {
  const propertiesDict = viewObject.ExportProperties();
  const dict = Object.entries(propertiesDict);
  console.log(dict);
  // textId.setAttribute('value', String(propertiesDict.id));
  // callJsFunc(viewObject);
  for (const [key, value] of Object.entries(dict)) {
    const textInput = document.getElementById('text_' + value[0]);
    textInput.setAttribute('value', String(value[1]));
    console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
  }
  // const keysDict = keys<propertiesDict>();
}
