import {ViewObject, WallExportedProperties} from '../canvas_components/view_object';
import {RoomExportedProperties} from '../canvas_components/view_object';

export function UIIndex(viewObject: ViewObject): void {
  const propertiesDict = viewObject.ExportProperties();
  const dict = Object.entries(propertiesDict);
  console.log(dict);
  
  // todo 
  // if ('length' in propertiesDict) {
  //   $('#input_length').val(String(propertiesDict['length']['value']));
  // }

  // const selector = $('#select');
  // if (propertiesDict instanceof WallExportedProperties ||
  //     propertiesDict instanceof RoomExportedProperties) {
  //   for (const value of propertiesDict.type.options) {
  //     selector.append($('<option></option>').text(value));
  //   }

  //   selector.val(propertiesDict.type.value);
  //   selector.selectpicker('refresh');
  // }
}
