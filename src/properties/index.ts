import { Wall } from "../view_elements/wall";

export function displayWallProperty(wall: Wall): void {
    const length = wall.length;
    const textProperty = document.getElementById('property_length') as HTMLInputElement;
    textProperty.value = length.toString();
}
