import {imageLib} from './images/image_config';

const imageMap = new Map<string, HTMLImageElement>();

export async function LoadImages() {
  return new Promise((resolve) => {
    let count = 0;
    const onLoad = () => {
      count += 1;
      if (count === Object.keys(imageLib).length) {
        resolve();
      }
    };

    Object.keys(imageLib).forEach(key => {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = imageLib[key];
      imageMap.set(key, img);
    });
  });
}


export function GetImage(key: string): HTMLImageElement {
  return imageMap.get(key);
}
