import { Rectangle } from "pixi.js";

export function rectIntersect(aBox:Rectangle, bBox:Rectangle) {

    return aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.x + bBox.width &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.y + bBox.height;
        
}