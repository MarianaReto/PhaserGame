export default class Laser extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y){
        super(scene, x, y, "laser");
        
        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.baseVelocity = 200;

        this.setScale(0.4);
    }

    fire (x, y, vx){
        this.active = true;
        this.visible = true; 
        this.setVelocityX(vx);
        this.setPosition(x, y);
    }

    removeFromScreen() {
        this.x = -100;
        this.setVelocity(0, 0);
    }

    isOutsideCanvas() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        return this.x > width || this.y > height || this.x < 0 || this.y < 0;
    }
}