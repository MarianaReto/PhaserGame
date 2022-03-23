import Bullet from "./Bullet.js"

export default class Protagonist extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "protagonist");

        this.scene.add.existing(this);

        this.scene.physics.world.enable(this);

        //ativa colisão com as bordas do jogo
        this.setCollideWorldBounds(true);

        this.setSize(50, 100);

        //vars
        this.speed = 150;
        this.bulletSpeed = 350;
        this.jumpSpeed = 300;
        this.gravitySpeed = 600;
        this.fireRate = 500;
        this.width = this.scene.game.config.width;
        this.height = this.scene.game.config.height;
        this.timeToShoot = 0;
        this.timeToJump = 0;
        this.hp = 1000;
        this.canBeKilled = true;
        this.facing = "right";
        this.bulletDamage = 100;
        this.canShoot = true;
        this.bulletsMaxsize = 20;

        this.bullets = this.scene.physics.add.group({
            maxSize: this.bulletsMaxsize,
            classType: Bullet
        });
        
        

        this.scene.anims.create({   
            key: "protagonist-idle-right",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 17,
                end: 29,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "protagonist-idle-left",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 77,
                end: 89,
            }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "walking-right",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 48,
                end: 53,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "walking-left",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 108,
                end: 113,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "jump-right",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 30,
                end: 45,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "jump-left",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 90,
                end: 105,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "die-right",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 0,
                end: 14,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({   
            key: "die-left",
            frames: this.scene.anims.generateFrameNumbers("protagonist", {
                start: 60,
                end: 74,
            }),
            frameRate: 30,
            repeat: -1
        });

        this.setScale(0.3);
        this.setGravityY(this.gravitySpeed);
    }

    update(cursors, time){
        var randomNumber = 3;
        //generates a random number between 1 and 2
        while (randomNumber > 2)
            randomNumber = Math.floor(Math.random() * 10) + 1;

        
        if (cursors.left.isDown) { 
            this.setVelocityX(-this.speed); 
            this.facing = "left";
            this.anims.play("walking-left", true); 
            //this.scene.sound.play("sfx_movement_footsteps" + randomNumber);
        } else if (cursors.right.isDown) { 
            this.setVelocityX(this.speed); 
            this.facing = "right"; 
            this.anims.play("walking-right", true); 
            //this.scene.sound.play("sfx_movement_footsteps" + randomNumber);
        } else { 
            this.setVelocityX(0); 
            this.anims.play("protagonist-idle-" + this.facing, true); 

        }

        

        var standing =  this.body.blocked.down || this.body.touching.down || this.body.onFloor();

        if (cursors.up.isDown && standing) {
            this.setVelocityY(-this.jumpSpeed);
            this.anims.play("jump-" + this.facing, true);
            //this.scene.sound.play("sfx_movement_jump");
        }

        /*
        if(!standing)
            this.scene.sound.play("sfx_movement_falling");
        */

        if (cursors.space.isDown && this.timeToShoot < time && this.canShoot) {
            let bullet = this.bullets.getFirstDead(true, this.x, this.y);

            if (bullet) {
                if(this.facing == "right")
                    bullet.setVelocityX(this.bulletSpeed);
                else
                    bullet.setVelocityX(-this.bulletSpeed);
                bullet.active = true;
                bullet.visible = true;

                this.scene.sound.play("sfx_weapon_shotgun");
            }

            this.timeToShoot = time + this.fireRate;

            if (this.bullets.children.size > this.bulletsMaxsize) {
                console.log("Group size failed")
            }
            
        }
        this.bullets.children.iterate(function(bullet){
            if(bullet.isOutsideCanvas()){
                this.bullets.killAndHide(bullet);
            }
        }, this);
    }

    removeHP(damage){
        this.hp -= damage;

        if(this.hp <= 0){
            this.anims.play("die-" + this.facing, true);
        }
    }
}