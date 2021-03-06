import { Vector2 } from "../../vector";
import { Button } from "./Button";
import { Container, Text } from 'pixi.js';
import { WaveAnimation } from "./animation";

let restartButton:Button;
let gameOverText:Text;
let highScoreText:Text;
let textAnimation:WaveAnimation;

export function updateHighScore(highScore:number) {
    highScoreText.text = 'HIGH SCORE: ' + String(highScore);
}

export function createMenu(container:Container, viewCanvas:HTMLCanvasElement, restartCallback:()=>void) {
    
    restartButton = new Button(new Vector2(viewCanvas.width / 2, viewCanvas.height - 100),
    new Vector2(250, 100), 
    new Text('RESTART', {fontSize: 50, fontFamily: 'CWEB', letterSpacing: 10}), restartCallback);
    
    gameOverText = new Text('GAME OVER!', {fill: 'white', align: 'center', fontSize: 70, fontFamily: 'CWEB', letterSpacing: 10}); 
    gameOverText.anchor.set(0.5);
    gameOverText.x = viewCanvas.width / 2;
    gameOverText.y = 200; 

    highScoreText = new Text('HIGH SCORE: ' + String(0), {fill: 'white', align: 'center', fontSize: 60, fontFamily: 'CWEB', letterSpacing: 10}); 
    highScoreText.anchor.set(0.5);
    highScoreText.x = viewCanvas.width / 2;
    highScoreText.y = 250; 

    textAnimation = new WaveAnimation(2, 0.05, gameOverText.position);
    
    container.addChild(restartButton.button, gameOverText, highScoreText);
}
