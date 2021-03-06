import { Sprite, Texture, Container } from 'pixi.js'
import { Vector2 } from "./vector";

export class Tube {

    public size:Vector2;
    public sprite:Sprite;

    private lastPosition:Vector2 = new Vector2();
    private position:Vector2 = new Vector2();

    get getPosition():Vector2 {
        return this.position;
    }
    get getLastPosition():Vector2 {
        return this.lastPosition;
    }

    constructor(size:Vector2, position:Vector2, angle:number, texture:Texture, container:Container) {
        this.size = size;
        this.sprite = new Sprite(texture);
        this.sprite.width = this.size.x;
        this.sprite.height = this.size.y;
        this.sprite.anchor.set(0.5, 0);
        this.setPosition(position.x, position.y);
        this.sprite.angle = angle;

        container.addChild(this.sprite);
    }

    public move(x:number, y:number) {
        this.lastPosition.set(this.position.x, this.position.y);
        this.position.x += x;
        this.position.y += y;
        this.sprite.position.set(this.position.x, this.position.y);
    }

    public setPosition(x:number, y:number) {
        this.lastPosition.set(this.position.x, this.position.y);
        this.position.set(x, y);
        this.sprite.position.set(this.position.x, this.position.y);
    }
}