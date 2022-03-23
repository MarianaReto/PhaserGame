export default class finalScene extends Phaser.Scene{
    constructor(){
        super("FinalScene");
    }

    create(){
        this.sound.play("6",{
            loop: true
        });

        var w = this.game.renderer.width, h = this.game.renderer.height;
        this.add.image(w/2, h/2, "space_bg").setScale(15);
        this.add.image(w/2, h/2 - 50, "congratulations");
        this.add.image(w/2, h/2 + 100, "message");
    }
}