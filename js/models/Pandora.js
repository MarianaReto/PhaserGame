export default class Pandora extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, x, y){
        super(scene, x, y, "pandora");

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setCollideWorldBounds(true); //activates collision with world bounds
        this.setGravityY(300); 
        this.setImmovable(); //the player can't move the enemy
        this.createAnims();
        this.facing = "left";
        this.speed = 25;
        this.hp = 1000;
        this.attackDamage = 200;
        this.body.setSize(20, 37);
        this.fighting = false;
        //time enemy needs between 2 consecutive attacks
        this.attackTime = 5000;
        //Start of next attack
        this.nextAttackStartTime = 0;
    }

    createAnims(){
        /**
         * IDLE
         */
        this.scene.anims.create({   
            key: "pandora-idle-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-idle-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 320,
                end: 323,
            }),
            frameRate: 10,
            repeat: 0
        });

        /**
         * WALK
         */
        this.scene.anims.create({   
            key: "pandora-walk-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 20,
                end: 27,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-walk-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 340,
                end: 347,
            }),
            frameRate: 20,
            repeat: 0
        });


        /**
         * DEAD
         */
        this.scene.anims.create({   
            key: "pandora-dead-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 80,
                end: 86,
            }),
            frameRate: 5,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-dead-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 400,
                end: 406,
            }),
            frameRate: 5,
            repeat: 0
        });

        /**
         * Flying Kick
         */
        this.scene.anims.create({   
            key: "pandora-flyingkick-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 140,
                end: 147,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-flyingkick-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 460,
                end: 467,
            }),
            frameRate: 10,
            repeat: 0
        });

        /**
         * lowkick
         */
        this.scene.anims.create({   
            key: "pandora-lowkick-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 200,
                end: 205,
            }),
            frameRate: 50,
            repeat: 2
        });

        this.scene.anims.create({   
            key: "pandora-lowkick-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 520,
                end: 525,
            }),
            frameRate: 50,
            repeat: 2
        });

        /**
         * middlekick
         */
        this.scene.anims.create({   
            key: "pandora-middlekick-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 206,
                end: 211,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-middlekick-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 526,
                end: 531,
            }),
            frameRate: 20,
            repeat: 0
        });

        /**
         * highkick
         */
        this.scene.anims.create({   
            key: "pandora-highkick-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 220,
                end: 225,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-highkick-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 540,
                end: 545,
            }),
            frameRate: 20,
            repeat: 0
        });

        /**
         * downwardkick
         */
        this.scene.anims.create({   
            key: "pandora-downwardkick-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 240,
                end: 247,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-downwardkick-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 560,
                end: 567,
            }),
            frameRate: 20,
            repeat: 0
        });

        /**
         * roundkick
         */
        this.scene.anims.create({   
            key: "pandora-roundkick-right",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 280,
                end: 287,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "pandora-roundkick-left",
            frames: this.scene.anims.generateFrameNumbers("pandora", {
                start: 600,
                end: 607,
            }),
            frameRate: 20,
            repeat: 0
        });
    }

    idle(){
        
        this.anims.play("pandora-idle-" + this.facing, true);
    }

    walk(){
        this.anims.play("pandora-walk-" + this.facing, true);
    }

    jump(){
        this.anims.play("pandora-jump-" + this.facing, true);
    }

    dead(){
        this.anims.play("pandora-dead-" + this.facing, true);
        this.on("animationcomplete", ()=>{
            this.visible = false;
            this.active = false;
            this.removeFromScreen();
        });
    }

    attack(){
        var randomNumber = 6;
        //generates a random number between 0 and 5
        while (randomNumber > 5)
            randomNumber = Math.floor(Math.random() * 10);

        if (randomNumber == 0)
            this.anims.play("pandora-flyingkick-" + this.facing, true);
        else if (randomNumber == 1)
            this.anims.play("pandora-lowkick-" + this.facing, true);
        else if (randomNumber == 2)
            this.anims.play("pandora-middlekick-" + this.facing, true);
        else if (randomNumber == 3)
            this.anims.play("pandora-highkick-" + this.facing, true);
        else if (randomNumber == 4)
            this.anims.play("pandora-downwardkick-" + this.facing, true);
        else
            this.anims.play("pandora-roundkick-" + this.facing, true);
    }

    walkTo(protagonist){
        if (protagonist.x < this.x){
            this.facing = "left";
            this.setVelocityX(-this.speed);
            this.walk();
        }
        else if (protagonist.x > this.x){
            this.facing = "right";
            this.setVelocityX(this.speed);
            this.walk();
        }
    }

    fight(protagonist, time){
        if (this.x > protagonist.x)
            this.lookleft();
        else
            this.lookright();

        if (time > this.nextAttackStartTime){
            this.attackProtagonist(protagonist);
            this.nextAttackStartTime = time + this.attackTime;
            this.on("animationcomplete", ()=>{
                this.idle();
            });
        }
        
        if (time > this.nextAttackStartTime)
        this.idle();
    }

    lookleft(){
        this.facing = "left";
    }
    
    lookright(){
        this.facing = "right";
    }

    attackProtagonist(protagonist){
        this.setVelocityX(0);
        protagonist.hp -= this.attackDamage;

        //generates a random number between 1 and 10
        var randomNumber = Math.floor(Math.random() * 10) + 1;
        this.scene.sound.play("sfx_damage_hit" + randomNumber);

        this.attack();
    }

    removeFromScreen() {
        this.x = -500;
        this.y = 400;
        this.setVelocity(0, 0);
    }
}