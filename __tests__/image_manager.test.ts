jest.mock('../src/images/image_config');

import * as ImageManager from '../src/image_manager';

describe('image manager', () => {
  test('load image', () => {
    ImageManager.LoadImages();
    const img = ImageManager.GetImage('image-key');
    expect(img).toBeDefined();
  });
});