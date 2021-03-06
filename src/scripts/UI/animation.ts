import { Ticker, ObservablePoint } from 'pixi.js';
import { Vector2 } from '../../vector';

abstract class Animation {
    protected point: ObservablePoint;
    protected startPos:Vector2 = new Vector2();

    constructor(point: ObservablePoint) {
        this.point = point;
        this.startPos = new Vector2(this.point.x, this.point.y);
    }
    
    protected abstract update():void;
}

export class WaveAnimation extends Animation {

    private t:number = 0;
    private waveSpeed:number;
    private waveAmp:number;

    constructor(waveAmp:number = 2, waveSpeed:number = 0.05, point:ObservablePoint) {
        super(point);
        this.waveAmp = waveAmp;
        this.waveSpeed = waveSpeed;

        Ticker.shared.add(() => {this.update();});
    }

    protected update() {
        this.t += Ticker.shared.deltaTime;
        this.point.y = this.startPos.y + (Math.cos(this.t * this.waveSpeed) * this.waveAmp);
    }
}
