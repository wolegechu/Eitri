
export enum ImageHandle {
  DOOR,
}


const imageMap = new Map<ImageHandle, HTMLImageElement>();
export function GetImage(h: ImageHandle): HTMLImageElement {
  return imageMap.get(h);
}

const doorImg = new Image();
doorImg.src = require('./images/door.png');
imageMap.set(ImageHandle.DOOR, doorImg);