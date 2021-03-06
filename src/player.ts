import { Rigidbody } from "./rigidbody";
import { Vector2 } from "./vector";
import { AnimatedSprite, Container } from 'pixi.js'
import sound from 'pixi-sound';
import { PlayerAudioController } from "./scripts/Sound/playerAudioController";

export class Player extends Rigidbody{

    public sprite:AnimatedSprite;
    private deathPoff:AnimatedSprite;
    private container:Container;
    private startPos:Vector2 = new Vector2();
    private keyPressed:boolean = false;
    private audioController:PlayerAudioController;
    private dead:boolean = false;

    constructor(playerSprite:AnimatedSprite, deathPoff:AnimatedSprite, startPos:Vector2, container:Container, audioController:PlayerAudioController) {
        super();
        this.startPos = startPos;
        this.container = container;
        this.deathPoff = deathPoff;
        this.sprite = playerSprite;

        this.audioController = audioController;

        this.inializePlayer();

        window.addEventListener('keydown', (e) => {
            this.onKeyDown(e);
        });
        window.addEventListener('keyup', (e) => {
            this.onKeyUp(e);
        });
    }

    private onKeyDown(key:KeyboardEvent) {
        if(!this.dead && !this.keyPressed && key.keyCode === 32) {
            this.velocity.y = 5;
            this.audioController.playJumpSound();
            this.keyPressed = true;
        }    
    }

    private onKeyUp(key:KeyboardEvent) {
        if(key.keyCode === 32) {
            this.keyPressed = false;
        }    
    }

    private inializePlayer() {

        //The 'collider' is a invisible sprite we place on the player. we do this because we want the 'collider' to be slightly smaller than the players sprite.
        this.collider.anchor.set(0.5);
        this.collider.width = 150;
        this.collider.height = 150;

        this.sprite.animationSpeed = 0.5;
        this.sprite.play(); 
        this.sprite.width = 60;
        this.sprite.height = 45;
        this.sprite.anchor.set(0.5);
        this.sprite.addChild(this.collider);
        this.sprite.position.set(this.startPos.x, this.startPos.y);   
    
        this.deathPoff.animationSpeed = 0.15;
        this.deathPoff.width = 60;
        this.deathPoff.height = 60;
        this.deathPoff.anchor.set(0.5);
        this.deathPoff.visible = false;

        this.container.addChild(this.sprite, this.deathPoff);
    }

    public update(delta:number) {
        this.velocity.y += (-0.15 * delta);
        
        if(this.velocity.y <= -10) {
            this.velocity.y = -10;
        }

        this.sprite.rotation = -(this.velocity.y / 10);
        this.sprite.position.y -= this.velocity.y;
    }

    public reset() {
        this.dead = false;
        this.sprite.visible = true; 
        this.deathPoff.visible = false;
        this.sprite.rotation = 0;
        this.velocity.y = 0;
        this.sprite.position.set(this.startPos.x, this.startPos.y);  
    }

    public death() {
        this.dead = true;
        this.audioController.playeDeathSound();
        this.sprite.visible = false;
        this.deathPoff.gotoAndPlay(0);
        this.deathPoff.onComplete = () => {this.deathPoff.visible=false;}
        this.deathPoff.visible = true,
        this.deathPoff.position = this.sprite.position;
        this.deathPoff.loop = false;
        this.deathPoff.play();
    }
}