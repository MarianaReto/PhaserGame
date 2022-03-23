export default class Bullet extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y){
        super(scene, x, y, "bullet");
        
        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        this.baseVelocity = 350;

        this.setScale(0.5);
    }

    fire (enemy){
        const dx = enemy.x - this.x;
        this.setVelocityX(dx);
        this.active = true;
        this.visible = true;        
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