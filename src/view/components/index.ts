import {Wall} from '../../view/drawing_board/wall';
import {ViewObject, ExportedProperties} from '../drawing_board/view_object';

type SetPropertyFunc = (props: ExportedProperties) => void;
export type UIDisplayFunc = (properties: ExportedProperties, setFunc: SetPropertyFunc) => void;
let uiDisplayFunc: UIDisplayFunc = null;

export function SetUIDisplayFunc(func: UIDisplayFunc) {
  uiDisplayFunc = func;
}

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
  const setFunc = viewObject.ImportProperties;
  if (uiDisplayFunc) {
    uiDisplayFunc(propertiesDict, setFunc);
  }
}
