import { Sprite, Container, Texture, Ticker } from 'pixi.js';

export class FadeInOut {
    private spriteFade:Sprite;
    private state = this.idle;
    private fadeCallback!: () => void;

    constructor(viewCanvas:HTMLCanvasElement, container:Container, startAlpha:number = 0,) {
        this.spriteFade = new Sprite(Texture.WHITE);
        this.spriteFade.scale.set(viewCanvas.width, viewCanvas.height);
        this.spriteFade.tint = 0x000000;
        this.spriteFade.alpha = startAlpha;
        this.spriteFade.zIndex = 10;

        this.state = this.idle;

        container.addChild(this.spriteFade);
    }

    public update() {
        this.state();
    }

    private idle() {

    }

    public enterFadeIn(callback:()=>void) {
        this.fadeCallback = callback;
        this.state = this.fadeIn;
    }

    public enterFadeOut(callback:()=>void) {
        this.fadeCallback = callback;
        this.state = this.fadeOut;
    }

    private fadeIn() {
        if(this.spriteFade.alpha < 1) {
            this.spriteFade.alpha += Ticker.shared.deltaTime * 0.065;
        } else {
            this.spriteFade.alpha = 1;

            if(this.fadeCallback) {
                this.fadeCallback();
            }        
        }
    }

    private fadeOut() {
        if(this.spriteFade.alpha > 0) {
            this.spriteFade.alpha -= Ticker.shared.deltaTime * 0.065;
        } else {
            this.spriteFade.alpha = 0;

            if(this.fadeCallback) {
                this.fadeCallback();
            }

            this.state = this.idle;
        }
    }
}