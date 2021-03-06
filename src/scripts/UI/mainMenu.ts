import { Text, Container } from 'pixi.js';
import { Button } from "./Button";
import { Vector2 } from "../../vector"; 
import { fadeController, enterIntro } from "../../index";
import { WaveAnimation } from './animation';

let titleText:Text;
let textAnimation:WaveAnimation;

export function createMenu(mainMenuContainer:Container, viewCanvas:HTMLCanvasElement) {
    titleText = new Text('BIRDY\nBIRD', {fill: 'white', align: 'center', dropShadow: true, dropShadowDistance: 10, dropShadowAlpha: 0.6, dropShadowAngle: Math.PI * 0.8, fontSize: 80, fontFamily: "CWEB", letterSpacing: 10});
    titleText.anchor.set(0.5);
    titleText.x = viewCanvas.width / 2;
    titleText.y = 100;

    textAnimation = new WaveAnimation(2, 0.05, titleText.position);

    let playButton = new Button(new Vector2(viewCanvas.width / 2, viewCanvas.height / 2 + 125),
        new Vector2(200, 100), 
        new Text('PLAY', {fontSize: 50, fontFamily: "CWEB", letterSpacing: 10}),
        () => { fadeController.enterFadeIn(() => { enterIntro()}); });

    mainMenuContainer.addChild(playButton.button, titleText);
}