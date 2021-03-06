import sound from 'pixi-sound';
import { Loader } from 'pixi.js';

export class GameAudioController {

    private menuMusic:sound.Sound;
    private inGameMusic:sound.Sound;

    private scoreSound:sound.Sound;

    constructor(appLoader:Loader) {
        this.menuMusic = sound.Sound.from(appLoader.resources['MenuMusic']);
        this.menuMusic.loop = true;
        this.menuMusic.volume = 0.2;
        this.menuMusic.play();
        
        this.inGameMusic = sound.Sound.from(appLoader.resources['InGameMusic']);
        this.inGameMusic.loop = true;
        this.inGameMusic.volume = 0.2;
    
        this.scoreSound = sound.Sound.from(appLoader.resources["ScoreIncrease"]);
        this.scoreSound.volume = 0.25;
    }

    public playMenuMusic() {
        if(this.inGameMusic.isPlaying)
            this.inGameMusic.stop();
        if(!this.menuMusic.isPlaying)
            this.menuMusic.play();
    }

    public playInGameMusic() {
        if(this.menuMusic.isPlaying)
            this.menuMusic.stop();
        if(!this.inGameMusic.isPlaying)
            this.inGameMusic.play();
    }

    public playScoreSound() {
        this.scoreSound.play();
    }

}