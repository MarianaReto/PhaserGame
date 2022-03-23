import Laser from "./Laser.js"

export default class Enemy extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "enemy");

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setCollideWorldBounds(true); //activates collision with world bounds
        this.setGravityY(300); 
        this.setScale(0.4);
        this.setImmovable(); //the player can't move the enemy

        this.facing = "right";
        this.speed = 50;
        this.xmin = x - 20;
        this.xmax = x + 10;

        //settings for the lasers that the enemy fires
        this.timeToShoot = 0;
        this.laserMaxsize = 20;
        this.laserSpeed = 350;
        this.fireRate = 30;

        this.lasers = this.scene.physics.add.group({
            maxSize: this.laserMaxsize,
            classType: Laser
        });
        

        //animations
        this.scene.anims.create({   
            key: "walk-left",
            frames: this.scene.anims.generateFrameNumbers("enemy", {
                start: 3,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "walk-right",
            frames: this.scene.anims.generateFrameNumbers("enemy", {
                start: 6,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "look-left",
            frames: this.scene.anims.generateFrameNumbers("enemy", {
                start: 4,
                end: 4,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "look-right",
            frames: this.scene.anims.generateFrameNumbers("enemy", {
                start: 7,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    //kills enemies in the case they manage to leave the map
    update(){
        if(this.isOutsideCanvas())
            this.destroy();
    }


    dead(){
        this.visible = false;
        this.active = false;
        this.removeFromScreen();
        this.destroy();
    }

    removeFromScreen() {
        this.x = -500;
        this.y = 400;
        this.setVelocity(0, 0);
    }

    spawn() {
        this.visible = true;
        this.active = true;
    }

    //determines if enemy is outside map canvas
    isOutsideCanvas() {
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;

        return this.x > width || this.y > height || this.x < 0 || this.y < 0;
    }

    //shoots in the direction the enemy is facing
    shootLaser(time){

       if (time > this.timeToShoot) {
            var laser = this.lasers.get();
            if(laser){
                if(this.facing == "right"){
                    laser.fire(this.x + 15, this.y, this.laserSpeed);
                }
                else{
                    laser.fire(this.x - 15, this.y, -this.laserSpeed);
                }
                this.scene.sound.play("sfx_weapon_laser");
            }
        }
        this.timeToShoot = time + this.fireRate;

        this.lasers.children.iterate(function(laser){
            if(laser.isOutsideCanvas()){
                this.lasers.killAndHide(laser);
            }
        }, this);

    }

    //makes enemy walk back and forth
    wander(){
        if (this.facing == "left") {
            if(this.x > this.xmin) {
                this.walkLeft();
            }
            else {
                this.lookRight();
            }
        }
        else {
            if(this.x < this.xmax) {
                this.walkRight();
            }
            else {
                this.lookLeft();
            }
        }
    }

    //stops wandering and faces protagonist
    stopWandering(protagonist){
        this.setVelocity(0);
        if (this.x > protagonist.x){
            this.lookLeft();
        }
        else{
            this.lookRight();
        }
    }

    lookLeft(){
        this.facing = "left";
        this.anims.play("look-left");
    }

    lookRight(){
        this.facing = "right";
        this.anims.play("look-right");
    }

    walkLeft(){
        this.setVelocityX(-this.speed);
        this.facing = "left";
        this.anims.play("walk-left", true);
    }

    walkRight(){
        this.setVelocityX(this.speed);
        this.facing = "right";
        this.anims.play("walk-right", true);
    }

    //kills enemy
    die(){
        new Kaboom(this.scene, this.x, this.y);
        this.visible = false;
        this.active = false;
        this.removeFromScreen();
    }
}