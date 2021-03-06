import sound from 'pixi-sound';
import { Loader } from 'pixi.js';
import { app } from '../..';

export class PlayerAudioController {

    private jumpSound:sound.Sound;
    private deathSound:sound.Sound;


    constructor(appLoader:Loader) {
        this.jumpSound = sound.Sound.from(appLoader.resources["PlayerJump"]);
        this.jumpSound.volume = 0.5;
        this.deathSound = sound.Sound.from(appLoader.resources["PlayerDie"]);
        this.deathSound.volume = 0.4;
    }

    public playJumpSound() {
        this.jumpSound.play();
    }

    public playeDeathSound() {
        this.deathSound.play();
    }

}