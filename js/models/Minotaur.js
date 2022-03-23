export default class Minotaur extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "minotaur");

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setCollideWorldBounds(true); //activates collision with world bounds
        this.setGravityY(300); 
        this.setImmovable(); //the player can't move the enemy
        this.createAnims();
        this.facing = "left";
        this.speed = 25;
        this.hp = 2000;
        this.attackDamage = 300;

        this.body.setSize(50, 40);

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
            key: "minotaur-idle-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 0,
                end: 4,
            }),
            frameRate: 5,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "minotaur-idle-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 100,
                end: 104,
            }),
            frameRate: 5,
            repeat: 0
        });

        /**
         * run
         */
        this.scene.anims.create({   
            key: "run-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 10,
                end: 17,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "run-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 110,
                end: 117,
            }),
            frameRate: 10,
            repeat: 0
        });

        /**
         * Taunt
         */
        this.scene.anims.create({   
            key: "taunt-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 20,
                end: 24,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "taunt-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 120,
                end: 124,
            }),
            frameRate: 10,
            repeat: 0
        });

        /**
         * Attacks
         */
        this.scene.anims.create({   
            key: "attack1-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 30,
                end: 38,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack1-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 130,
                end: 138,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack2-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 40,
                end: 44,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack2-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 140,
                end: 144,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack3-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 50,
                end: 55,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack3-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 150,
                end: 155,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack4-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 60,
                end: 68,
            }),
            frameRate: 30,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "attack4-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 160,
                end: 168,
            }),
            frameRate: 30,
            repeat: 0
        });

       
        /**
         * Death
         */
        this.scene.anims.create({   
            key: "minotaur-death-right",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 90,
                end: 95,
            }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({   
            key: "minotaur-death-left",
            frames: this.scene.anims.generateFrameNumbers("minotaur", {
                start: 190,
                end: 195,
            }),
            frameRate: 10,
            repeat: 0
        });

    }

    idle(){
        this.anims.play("minotaur-idle-" + this.facing, true);
    }

    run(){
        this.anims.play("run-" + this.facing, true);
    }

    taunt(){
        this.setVelocityX(0);
        this.anims.play("taunt-" + this.facing, true);
    }

    attack(){
        var randomNumber = 5;
        //generates a random number between 1 and 4
        while (randomNumber > 4)
            randomNumber = Math.floor((Math.random() * 10) + 1);

        this.anims.play("attack" + randomNumber + "-" + this.facing, true);
    }

    damage(){
        var randomNumber = 3;
        //generates a random number between 1 and 2
        while (randomNumber > 2)
            randomNumber = Math.floor((Math.random() * 10) + 1);

        this.anims.play("damage" + randomNumber + "-" + this.facing, true);
    }

    dead(){
        this.anims.play("minotaur-death-" + this.facing, true);
        this.on("animationcomplete", ()=>{
            this.visible = false;
            this.active = false;
            this.removeFromScreen();
        });
    }

    
    fight(protagonist, time){
        if(this.x > protagonist.x)
            this.lookleft();
        else
            this.lookright();
        
        if(time > this.nextAttackStartTime){
            this.attackProtagonist(protagonist);
            this.nextAttackStartTime = time + this.attackTime;
            this.on("animationcomplete", ()=>{
                this.taunt();
            });
        }

        if(time > this.nextAttackStartTime)
            this.idle();
    }

    attackProtagonist(protagonist){
        this.setVelocityX(0);
        protagonist.hp -= this.attackDamage;

        //generates a random number between 1 and 10
        var randomNumber = Math.floor(Math.random() * 10) + 1;
        this.scene.sound.play("sfx_damage_hit" + randomNumber);

        this.attack();
    }

    runTo(min, max, protagonist){
        if(this.protagonistAtLeft(protagonist) && this.x > min + 30){
            this.facing = "left";
            this.setVelocityX(-this.speed);
            this.run();
        }
        else if (!this.protagonistAtLeft(protagonist) && this.x < max - 30){
            this.facing = "right";
            this.setVelocityX(this.speed);
            this.run();
        }
    }

    protagonistAtLeft(protagonist){
        if (protagonist.x < this.x)
            return true;
        return false;
    }

    stopAnims(){
        this.anims.stop();
    }

    lookleft(){
        this.facing = "left";
    }

    lookright(){
        this.facing = "right";
    }

    protagonistOutsidePlatform(min, max, protagonist){
        return (protagonist.x < min || protagonist.x > max);
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


    removeHP(damage){
        this.hp -= damage;

        if(this.hp <= 0){
            this.dead();
        }
    }
}