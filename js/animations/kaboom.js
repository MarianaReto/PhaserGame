export default class Kaboom extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "kaboom");

        this.scene.add.existing(this);

        this.scene.anims.create({   
            key: 'kaboom',
            frames: this.scene.anims.generateFrameNumbers('explosion'),
            frameRate: 20,
            repeat: 0
        });

        this.anims.play("kaboom");

    }

}