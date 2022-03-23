export default class menuScene extends Phaser.Scene{
    constructor(){
        super("MenuScene");
    }

    create(){
        this.sound.play("6",{
            loop: true
        });
        
        var w = this.game.renderer.width, h = this.game.renderer.height;

        //background
        this.background = this.add.tileSprite(0, 0, w, h + 15, "skyline_bg");
        this.background.set
        this.background.setScale(4);

        this.add.image(this.game.renderer.width/2, this.game.renderer.height*0.30, "logo");
        
        let playButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height/2, "play_button");

        //allows to interact with play button
        playButton.setInteractive();

        var randomNumber = 3;
        //generates a random number between 1 and 2
        while (randomNumber > 2)
            randomNumber = Math.floor(Math.random() * 10) + 1;

        playButton.on("pointerup", ()=>{
            this.sound.play("sfx_menu_select" + randomNumber);
            this.sound.stopAll();
            this.scene.start("FirstScene");
        })
    }

    update() {
        this.background.tilePositionX -= 0.05;  
    }
}