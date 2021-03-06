import { enterInGame } from "../../index";
import { Text, Container } from 'pixi.js';
import { WaveAnimation } from './animation';

let introText:Text;
let textAnimation:WaveAnimation;

export function createMenu(container:Container, viewCanvas:HTMLCanvasElement, checkIfInIntro:()=>boolean) {
    
    introText = new Text('PRESS [SPACE] TO START!', {fill: 'white', align: 'center', fontSize: 45, fontFamily: 'CWEB', letterSpacing: 10}); 
    introText.anchor.set(0.5);
    introText.x = viewCanvas.width / 2;
    introText.y = viewCanvas.height - 150; 
    
    textAnimation = new WaveAnimation(2, 0.05, introText.position);

    container.addChild(introText);
    
    window.addEventListener('keydown', (e:KeyboardEvent) => {
        if(e.keyCode === 32 && checkIfInIntro() === true) {
            enterInGame();
        }   
    });

}


