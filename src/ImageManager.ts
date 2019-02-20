
export enum ImageHandle {
  GRID,
  DOOR,
  BED,
}


const imageMap = new Map<ImageHandle, HTMLImageElement>();
export function GetImage(h: ImageHandle): HTMLImageElement {
  return imageMap.get(h);
}

{
  const img = new Image();
  img.src = require('./images/door.png');
  imageMap.set(ImageHandle.DOOR, img);
}

{
  const img = new Image();
  img.src = require('./images/bed.png');
  imageMap.set(ImageHandle.BED, img);
}

{
  const img = new Image();
  img.src = require('./images/grid.png');
  imageMap.set(ImageHandle.GRID, img);
}
