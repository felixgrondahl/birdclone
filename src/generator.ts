import {Vector2} from './vector';
import { Tube } from './tube';
import { Texture, Container } from 'pixi.js';

export class Generator {

    private tubeWidth:number;
    private tubeDist:number;    //the distance between each tube
    private holeSize:number;
    private viewCanvas:HTMLCanvasElement;   //we need this because we use its dimensions for the tube generation
    private container:Container;
    private tubeTexture:Texture;

    public tubes:Tube[] = [];  //all created tubes
    private tubeSize:Vector2 = new Vector2();
    private numOfPipes:number = 0;
    private scrollSpeed:number = 1.5;

    private yBasePosUpper:number 
    private yBasePosLower:number 

    constructor(tubeWidth:number, holeSize:number, texture:Texture, viewCanvas:HTMLCanvasElement, container:Container){
        this.tubeWidth = tubeWidth;
        this.holeSize = holeSize;
        this.viewCanvas = viewCanvas;
        this.container = container;
        this.tubeTexture = texture;

        this.tubeSize = new Vector2(tubeWidth, viewCanvas.height);
        this.numOfPipes = 3;
        this.yBasePosUpper = (this.tubeSize.y / 2) - (this.holeSize / 2);
        this.yBasePosLower = (this.tubeSize.y / 2) + (this.holeSize / 2);
        this.tubeDist = (this.viewCanvas.width / this.numOfPipes) + (this.tubeWidth / this.numOfPipes);
    }

    public generate() {
        //this is the start offset for the first pipe
        const xPos = this.viewCanvas.width;
        let yOffset = 0;
        let xOffset = 0;
          //the distance between each tube is based on the number of pipes we want on the screen at the same time

        for(let i = 0; i < this.numOfPipes; i++) {          
            yOffset = this.getYOffset();
            xOffset = xPos + (this.tubeDist * i) + (this.tubeSize.x / 2);
            this.tubes.push(new Tube(this.tubeSize, new Vector2(xOffset, this.yBasePosUpper + yOffset), 180, this.tubeTexture, this.container));
            this.tubes.push(new Tube(this.tubeSize, new Vector2(xOffset, this.yBasePosLower + yOffset), 0, this.tubeTexture, this.container));
        }
    }

    //Scrolling and resetting the tubes
    public update(delta:number) {
        for (let i = 0; i < this.tubes.length - 1; i+=2) {
            this.tubes[i].move((-this.scrollSpeed * delta), 0);
             this.tubes[i + 1].move((-this.scrollSpeed * delta), 0);

             //If the tube is outside the view, move it back to the beginning
            if(this.tubes[i].getPosition.x < (0 - (this.tubeSize.x * 0.5))) {
                this.resetTubes(this.tubes[i], this.tubes[i + 1]);
            }
        }
    }

    private resetTubes(upperTube:Tube, lowerTube:Tube) {
        let xPos = this.viewCanvas.width + (this.tubeSize.x * 0.5);

        const yOffset = this.getYOffset();
        upperTube.setPosition(xPos, this.yBasePosUpper + yOffset);
        lowerTube.setPosition(xPos, this.yBasePosLower + yOffset);
    }

    public resetAllTubes() {
        let xPos = this.viewCanvas.width + (this.tubeSize.x * 0.5);

        for (let i = 0, column = 0; i < this.tubes.length - 1; i+=2, column++) {
            const yOffset = this.getYOffset();
            const xOffset = xPos + (this.tubeDist * column);
            this.tubes[i].setPosition(xOffset, this.yBasePosUpper + yOffset);
            this.tubes[i + 1].setPosition(xOffset, this.yBasePosLower + yOffset);
        }

    }

    private getYOffset() {
        return ((Math.random() * (this.tubeSize.y / 2)) * (Math.random() <= 0.5 ? -1 : 1)) * 0.5;
    }

}