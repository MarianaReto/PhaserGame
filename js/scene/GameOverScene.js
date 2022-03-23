export default class GameOver extends Phaser.Scene{
    constructor(){
        super("GameOverScene");
    }

    create(){
        this.sound.play("6",{
            loop: true
        });

        var w = this.game.renderer.width, h = this.game.renderer.height;
        this.add.image(w/2, h/2, "gameover");
        let restart = this.add.image(w/2, h/2 + 100, "restart");
        restart.setInteractive();

        restart.on("pointerup", ()=>{
            this.sound.stopAll();
            this.scene.start("SecondScene");
        });

    }
}