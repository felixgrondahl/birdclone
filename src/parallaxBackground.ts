import { TilingSprite, Texture, Container } from 'pixi.js';

export class ParallaxBackground {

    private tilingTextures:TilingSprite[] = [];
    private scrollSpeed:number = 0;
    private tilePosX:number = 0;

    constructor(textures:Texture[], scrollSpeed:number, container:Container, viewCanvas:HTMLCanvasElement) {
        //let t = new PIXI.TilingSprite(textures[0], viewCanvas.width, viewCanvas.height);
        textures.forEach((element) => {
            //element.frame.fit(new PIXI.Rectangle(0, 0, viewCanvas.width, viewCanvas.height));
            //element.frame.height = viewCanvas.height;
            let tiling = new TilingSprite(element, viewCanvas.width, viewCanvas.height);
            tiling.tileScale.set(2, 2);
            tiling.position.set(0, 0);
            container.addChild(tiling);

            this.tilingTextures.push(tiling);
        });
        //container.addChild(t);
        this.scrollSpeed = scrollSpeed;
    }

    public update(delta:number) {

        this.tilePosX += this.scrollSpeed * delta;
        let bgIndex = this.tilingTextures.length;

        this.tilingTextures.forEach((element) => {
            element.tilePosition.x = this.tilePosX / bgIndex;
            bgIndex /= 2;
        });

    }

}