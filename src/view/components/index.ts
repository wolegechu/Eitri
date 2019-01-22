import {ViewObject} from '../drawing_board/view_object';

export function UIIndex(viewObject: ViewObject): void {
  const propertiesDict = viewObject.ExportProperties();
  const dict = Object.entries(propertiesDict);
  console.log(dict);
  // textId.setAttribute('value', String(propertiesDict.id));
  // callJsFunc(viewObject);
  //debugger;
  
  for (const [key, value] of Object.entries(dict)) {
    const textInput = $('text_' + value[0]);
    textInput.text(String(value[1]));
    console.log(`${key} ${value}`);  // "a 5", "b 7", "c 9"
  }

}
