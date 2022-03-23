import bootGame from "./scene/BootGame.js";
import menuScene from "./scene/MenuScene.js";
import firstScene from "./scene/FirstScene.js";
import secondScene from "./scene/SecondScene.js";
import thirdScene from "./scene/ThirdScene.js";
import finalScene from "./scene/FinalScene.js";
import bossScene1 from "./scene/BossScene1.js";
import bossScene2 from "./scene/BossScene2.js";
import gameOverScene from "./scene/GameOverScene.js";

var game;
window.onload = function() {
    var gameConfig = {
        //dimensoes do canvas
        width: 1600,
        height: 900,    
        //width: 1600,
        //height: 288,        
        backgroundColor: 0x000000,
        //vai conter a logica do jogo
        scene: [bootGame,menuScene, gameOverScene, firstScene, secondScene, bossScene1, thirdScene, bossScene2, finalScene],
        render: {
            pixelArt: true
        },
        physics: {
            //modo arcade - pra ter gravidade
            default: "arcade",
            arcade: {
              //hitbox
              debug: false
            }
        }
    }
    //crio o jogo e passo-lhe estes parametros todos
    game = new Phaser.Game(gameConfig);
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
}

//redimensionar automaticamente o canvas
function resizeGame(){
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
