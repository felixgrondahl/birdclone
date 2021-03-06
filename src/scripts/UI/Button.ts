import { Graphics, Text } from 'pixi.js'
import { Vector2 } from "../../vector";

export class Button {

    public button:Graphics;
    private onClick:()=>void;

    constructor(position:Vector2, size:Vector2, label:Text, onClick:()=>void) {

        this.onClick = onClick;
        label.anchor.set(0.5);
        label.position.set(size.x / 2, size.y / 2);
        this.button = new Graphics();
        this.button.beginFill(0xFFFFFF);
        this.button.drawRoundedRect(0, 0, size.x, size.y, 12);
        this.button.endFill();
        this.button.interactive = true;
        this.button.buttonMode = true;

        this.button.addChild(label);
        this.button.position.set(position.x - (size.x / 2), position.y - (size.y / 2));

        this.button.on('pointerdown', () => {
            this.onButtonDown();
        });
        this.button.on('pointerup', () => {
            this.onButtonUp();
        });

    }

    private onButtonDown() {
        this.button.alpha = 0.5;
    }

    private onButtonUp() {
        this.button.alpha = 1;
        this.onClick();
    }

}