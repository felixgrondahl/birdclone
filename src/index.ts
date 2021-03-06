import * as PIXI from 'pixi.js';
import sound from 'pixi-sound'
import { Vector2 } from './vector';
import { Generator } from './generator';
import { Player } from './player';
import { rectIntersect } from './physics';
import { ParallaxBackground } from './parallaxBackground';
import { FadeInOut } from './fadeInOut';
import * as MainMenu from './scripts/UI/mainMenu';
import * as IntroMenu from './scripts/UI/introMenu';
import * as RestartMenu from './scripts/UI/restartMenu';
import { GameAudioController } from './scripts/Sound/gameAudioController';
import { PlayerAudioController } from './scripts/Sound/playerAudioController';


export let fadeController:FadeInOut;
let gameState = mainMenuState;
let background:ParallaxBackground;
let generator:Generator;
var player:Player;
let audioController:GameAudioController;
let playerAudioController:PlayerAudioController;

let score:number = 0;
let highScore:number = 0;
let scoreText:PIXI.Text;


export let app = new PIXI.Application({
    height: 500,
    width: 800,
    transparent: true
});
document.body.appendChild(app.view);

let backgroundContainer = new PIXI.Container();
let generatorContainer = new PIXI.Container();
let playerContainer = new PIXI.Container();
let mainMenuContainer = new PIXI.Container();
let gameOverContainer = new PIXI.Container();
let fadeContainer = new PIXI.Container();
let introContainer = new PIXI.Container();

app.stage.addChild(backgroundContainer,
    mainMenuContainer,
    generatorContainer,
    playerContainer,
    gameOverContainer,
    fadeContainer,
    introContainer);

app.loader
    .add('./assets/images/spritesheet.json')
    .add("poffSS", './assets/images/fx/poff.json')
    .add("foreground", './assets/images/Background/01.png')
    .add("foreBg", './assets/images/Background/02.png')
    .add("midground", './assets/images/Background/03.png')
    .add("background", './assets/images/Background/04.png')
    .add("tube", './assets/images/Tubes/TubeTexture.png')
    .add("mainFont", './assets/fonts/VCR_OSD_MONO_1.001.ttf')
    .add("MenuMusic", './assets/Sound/Music/MainMenu.mp3')
    .add("InGameMusic", './assets/Sound/Music/InGameMusic.mp3')
    .add("PlayerJump", './assets/Sound/fx/PlayerJump.wav')
    .add("ScoreIncrease", './assets/Sound/fx/scoreInc.wav')
    .add("PlayerDie", './assets/Sound/fx/PlayerDie.mp3')
    .onComplete.add(setup);
app.loader.load();

function setup() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    initialize();

    app.ticker.add(gameLoop);
    app.ticker.start();
}

function initialize() {
    audioController = new GameAudioController(app.loader);
    playerAudioController = new PlayerAudioController(app.loader);

    fadeController = new FadeInOut(app.view, fadeContainer, 1);
    fadeController.enterFadeOut(()=>{ enterMainMenu(); });

    //Create Background
    backgroundContainer.visible = true;
    let backgroundTextures = [app.loader.resources["background"].texture,
    app.loader.resources["midground"].texture,
    app.loader.resources["foreBg"].texture,
    app.loader.resources["foreground"].texture];
    background = new ParallaxBackground(backgroundTextures, 0.25, backgroundContainer, app.view);

    //SCORE
    scoreText = new PIXI.Text(String(score), {fill: 'white', align: 'center', fontSize: 60, fontFamily: 'CWEB', letterSpacing: 10}); 
    scoreText.anchor.set(0.5);
    scoreText.x = app.view.width / 2;
    scoreText.y = 50;
    playerContainer.addChild(scoreText);

    //INTRO
    IntroMenu.createMenu(introContainer, app.view, () => { return gameState === inGameIntroState})

    //Create Main Menu
    MainMenu.createMenu(mainMenuContainer, app.view);

    //Create Player
    let birdSpriteSheet = app.loader.resources['./assets/images/spritesheet.json'].spritesheet;
    let poffSpriteSheet = app.loader.resources['poffSS'].spritesheet;
    let sprite = new PIXI.AnimatedSprite(birdSpriteSheet!.animations["idle"]);
    let poffSprite = new PIXI.AnimatedSprite(poffSpriteSheet!.animations["poff"]);
    player = new Player(sprite, poffSprite, new Vector2((app.view.width / 2) - 100, app.view.height / 2), playerContainer, playerAudioController);

    //Create Game Over menu
    RestartMenu.createMenu(gameOverContainer, app.view, () => { fadeController.enterFadeIn(() => { restartEvent()}); });

    //Generate Level
    let tubeTexture = app.loader.resources["tube"].texture;
    generator = new Generator(75, 150, tubeTexture, app.view, generatorContainer);
    generator.generate();
}

function updateScore(newScore:number) {
    score = newScore;
    if(newScore > highScore)
        highScore = newScore;
    scoreText.text = String(newScore);
}

function gameLoop() {
    fadeController.update();
    gameState();
}

export function enterMainMenu() {
    audioController.playMenuMusic();
    gameState = mainMenuState;
}

export function enterIntro() {
    audioController.playInGameMusic();

    fadeController.enterFadeOut(() => {});
    gameState = inGameIntroState;
}

export function enterInGame() {
    gameState = inGameState;
}

function restartEvent() {
    updateScore(0);
    generator.resetAllTubes(); 
    player.reset(); 
    enterIntro();
}

function mainMenuState() {
    introContainer.visible = false;
    generatorContainer.visible = false;
    playerContainer.visible = false;
    mainMenuContainer.visible = true;
    backgroundContainer.visible = true;
    gameOverContainer.visible = false;

    background.update(app.ticker.deltaTime);
}

function inGameIntroState() {
    introContainer.visible = true;
    generatorContainer.visible = true;
    playerContainer.visible = true;
    mainMenuContainer.visible = false;
    backgroundContainer.visible = true;
    gameOverContainer.visible = false;
}

function inGameState() {
    introContainer.visible = false;
    generatorContainer.visible = true;
    playerContainer.visible = true;
    mainMenuContainer.visible = false;
    backgroundContainer.visible = true;
    gameOverContainer.visible = false;

    background.update(app.ticker.deltaTime);
    generator.update(app.ticker.deltaTime);
    player.update(app.ticker.deltaTime);

    //player collision
    for (let i = 0; i < generator.tubes.length; i++) {
        if(rectIntersect(player.collider.getBounds(), generator.tubes[i].sprite.getBounds()) || player.sprite.y > app.view.height || player.sprite.y < 0) {
            player.death();
            gameState = gameOver;
            break;
        }
        //When a tube pass the player, +1 score, we check (i % 2 === 0) because we only want to check once per tube duo.      
        if(i % 2 === 0 && generator.tubes[i].getLastPosition.x > player.sprite.x && generator.tubes[i].getPosition.x < player.sprite.x) {
            score++;
            audioController.playScoreSound();
            updateScore(score);
        }
    } 
}

function gameOver() {
    RestartMenu.updateHighScore(highScore);

    generatorContainer.visible = true;
    playerContainer.visible = true;
    mainMenuContainer.visible = false;
    backgroundContainer.visible = true;
    gameOverContainer.visible = true;
}
