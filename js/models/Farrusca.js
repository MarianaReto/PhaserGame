export default class Farrusca extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "farrusca");

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
            key: "farrusca-idle-right",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "farrusca-idle-left",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
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
            key: "farrusca-walk-right",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 20,
                end: 27,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "farrusca-walk-left",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
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
            key: "farrusca-dead-right",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 80,
                end: 86,
            }),
            frameRate: 5,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "farrusca-dead-left",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 400,
                end: 406,
            }),
            frameRate: 5,
            repeat: 0
        });

        /**
         * Power Punch
         */
        this.scene.anims.create({   
            key: "farrusca-powerpunch-right",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 100,
                end: 106,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "farrusca-powerpunch-left",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 420,
                end: 426,
            }),
            frameRate: 10,
            repeat: 0
        });

        /**
         * Fast Punch
         */
        this.scene.anims.create({   
            key: "farrusca-fastpunch-right",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 120,
                end: 125,
            }),
            frameRate: 50,
            repeat: 2
        });

        this.scene.anims.create({   
            key: "farrusca-fastpunch-left",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 440,
                end: 445,
            }),
            frameRate: 50,
            repeat: 2
        });

        /**
         * Uppercut
         */
        this.scene.anims.create({   
            key: "farrusca-uppercut-right",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 300,
                end: 305,
            }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "farrusca-uppercut-left",
            frames: this.scene.anims.generateFrameNumbers("farrusca", {
                start: 620,
                end: 625,
            }),
            frameRate: 20,
            repeat: 0
        });
    }

    idle(){
        this.anims.play("farrusca-idle-" + this.facing, true);
    }

    walk(){
        this.anims.play("farrusca-walk-" + this.facing, true);
    }

    jump(){
        this.anims.play("farrusca-jump-" + this.facing, true);
    }

    dead(){
        this.anims.play("farrusca-dead-" + this.facing, true);
        this.on("animationcomplete", ()=>{
            this.visible = false;
            this.active = false;
            this.removeFromScreen();
        });
    }

    attack(){
        var randomNumber = 3;
        //generates a random number between 0 and 2
        while (randomNumber > 2)
            randomNumber = Math.floor(Math.random() * 10);

        if (randomNumber == 0)
            this.anims.play("farrusca-powerpunch-" + this.facing, true);
        else if (randomNumber == 1)
            this.anims.play("farrusca-fastpunch-" + this.facing, true);
        else
            this.anims.play("farrusca-uppercut-" + this.facing, true);
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
            
            //generates a random number between 1 and 10
            var randomNumber = Math.floor(Math.random() * 10) + 1;
            this.scene.sound.play("sfx_damage_hit" + randomNumber);
    
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
        this.attack();
    }

    removeFromScreen() {
        this.x = -500;
        this.y = 400;
        this.setVelocity(0, 0);
    }
}