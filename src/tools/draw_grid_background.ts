/**
 * Draw the background grid with canvas.
 * You may use it to draw gird and export as SVG then convert to PNG.
 */

import { fabric } from "fabric";

export function DrawGridBackground(canvas: fabric.Canvas) {
    const options = {
        distance: 10,
        width: 4000,
        height: 4000,
        param: { stroke: '#E0EBEB', strokeWidth: 1, evented: false }
    };

    const gridLen = options.width / options.distance;
    for (let i = -gridLen / 2; i < gridLen / 2; i++) {
        const distance = i * options.distance,
            horizontal = new fabric.Line(
                [distance, -options.width / 2, distance, options.width / 2],
                options.param),
            vertical = new fabric.Line(
                [-options.width / 2, distance, options.width / 2, distance],
                options.param);
        canvas.add(horizontal);
        canvas.add(vertical);

        if (i % 5 === 0) {
            horizontal.set({ stroke: '#7AA7A7' });
            vertical.set({ stroke: '#7AA7A7' });
        }
    }
}