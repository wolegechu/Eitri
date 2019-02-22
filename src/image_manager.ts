import {imageLib} from './images/image_config';

const imageMap = new Map<string, HTMLImageElement>();

Object.keys(imageLib).forEach(key => {
  const img = new Image();
  img.src = imageLib[key];
  imageMap.set(key, img);
});

export function GetImage(key: string): HTMLImageElement {
  return imageMap.get(key);
}
