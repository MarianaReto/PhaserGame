import Protagonist from "../models/Protagonist.js"
import Enemy from "../models/Enemy.js"
import Kaboom from "../animations/kaboom.js"

export default class thirdScene extends Phaser.Scene{
    constructor(){
        super("ThirdScene");
    }

    preload(){
        this.load.image("tiles3", "assets/thirdlevel/tileset3.png");
        this.load.tilemapTiledJSON("thirdlevel", "assets/thirdlevel/level3.json");
    }

    create(){
        this.sound.play("5",{
            loop: true,
        });

        this.createTilemap();
        this.createCharacters();
        this.createGUI();
        this.createCamera();
        this.addCollisions();

        this.levelHeight = 288;
        this.lives = 3;
        this.laserDamage = 100;
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createTilemap(){
        //creating the level
        this.map = this.make.tilemap({ key: "thirdlevel" });
        const tileset = this.map.addTilesetImage("tileset3", "tiles3");
 
        //creating the layers for the level
        this.map.createStaticLayer("bg1", tileset, 0, 0);
        this.map.createStaticLayer("bg2", tileset, 0, 0);
        this.map.createStaticLayer("bg3", tileset, 0, 0);
        this.map.createStaticLayer("bg4", tileset, 0, 0);
        this.map.createStaticLayer("decorations", tileset, 0, 0);
        this.floor = this.map.createStaticLayer("floor", tileset);
    }

    //creates both the protagonist and the enemies
    createCharacters(){
        //creating the protagonist
        this.protagonist = new Protagonist(this, 30, 170);

        //creating enemies
        this.enemiesGroup = this.add.group();
        this.enemies = this.map.filterObjects('objects', (object) => object.type === 'enemy');
        this.createEnemies();
    }

    createGUI() {
        this.maxHP = this.protagonist.hp;
        this.healthPercentage = (this.protagonist.hp / this.maxHP) * 100;
        var x = this.protagonist.x, y = this.protagonist.y;

        this.labelHP = this.add.text(x - 10, y - 30, this.healthPercentage + "%",{
            fill: "#ffffff",
            fontSize: "10px"
        });
    }

    //makes the camera that follows the main Player
    createCamera(){
        const camera = this.cameras.main;
        camera.startFollow(this.protagonist);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setZoom(4);  
    }

    addCollisions(){
        this.floor.setCollisionByProperty({
            "collides": true
        }, true);

        this.floor.setCollisionByExclusion([-1]);

        this.physics.add.collider(this.protagonist, this.floor);
        this.physics.add.collider(this.enemiesGroup, this.floor);
        this.physics.add.collider(this.protagonist, this.enemiesGroup);
        this.physics.add.collider(this.protagonist.bullets, this.floor, this.destroyBullet, null, this);
        this.physics.add.overlap(this.protagonist.bullets, this.enemiesGroup, (bullet, enemy)=>{
            new Kaboom(this, enemy.x, enemy.y);

            var randomNumber = 14;
            //generates a random number between 1 and 13
            while (randomNumber > 13)
                randomNumber = Math.floor(Math.random() * 100) + 1;

            this.sound.play("sfx_exp_medium" + randomNumber);

            randomNumber = 9;
            //generates a random number between 1 and 8
            while (randomNumber > 8)
                randomNumber = Math.floor(Math.random() * 10) + 1;

            this.sound.play("sfx_deathscream_android" + randomNumber);

            this.enemiesGroup.killAndHide(enemy);
            enemy.removeFromScreen();

            this.protagonist.bullets.killAndHide(bullet);
            bullet.removeFromScreen();
            this.destroyBullet(bullet);
        });
    }

    update(time){
        this.protagonist.update(this.cursors, time);

        //if protagonist falls off tilemap
        if(this.protagonist.y > this.levelHeight)
            this.protagonistDead();

        if(this.protagonist.hp > 0){
            Phaser.Actions.Call(this.enemiesGroup.getChildren(), function (enemy) {
                if(this.protagonistSpotted(enemy)){
                    enemy.stopWandering(this.protagonist);
                    enemy.shootLaser(time);
                }
                else
                    enemy.wander();   
            }, this);
        }

        this.labelHP.x = this.protagonist.x - 10;
        this.labelHP.y = this.protagonist.y - 30;
        this.healthPercentage = (this.protagonist.hp / this.maxHP) * 100;
        this.labelHP.setText(this.healthPercentage + "%");

        if(this.protagonist.x > 1550){
            this.sound.stopAll();
            this.scene.start("BossScene2");
        }
    }

    //detects if protagonist is close to enemy
    protagonistSpotted(enemy){
        var dx = Math.abs(enemy.x - this.protagonist.x);
        var dy = Math.abs(enemy.y - this.protagonist.y);
        return (dx <= 200 && dy <= 50);
    }


    protagonistShot(protagonist, lasers){
        lasers.destroy();
        protagonist.hp -= this.laserDamage;

        //generates a random number between 1 and 10
        var randomNumber = Math.floor(Math.random() * 10) + 1;
        this.sound.play("sfx_damage_hit" + randomNumber);

        if(protagonist.hp <= 0){
            this.protagonistDead();
        }
    }
    
    //kills all enemies
    killAllEnemies(){
        this.enemiesGroup.clear(true);
    }

    //kills protagonist and resets level
    protagonistDead(){
        this.lives--;
        if(this.lives == 0){
            this.sound.stopAll();
            this.scene.start("GameOverScene");
        }
        else{        
            this.timer = this.time.addEvent({
            callback: () => {
              this.restartLevel()
            },
            callbackScope: this,
            repeat: 0
        });
        this.protagonist.hp = this.maxHP;
        }
    }

    createEnemies(){
        this.enemies.forEach((enemy) => {
            this.enemy = new Enemy(this, enemy.x, enemy.y);
            this.enemiesGroup.add(this.enemy); 
            this.physics.add.collider(this.enemy.lasers, this.protagonist, this.protagonistShot, null, this);
            this.physics.add.collider(this.enemy.lasers, this.floor, this.destroyLaser, null, this);
        });
    }

    //reset level
    restartLevel(){
        this.protagonist.setX(30);
        this.protagonist.setY(170);
        this.protagonist.hp = this.maxHP;
        this.killAllEnemies();
        this.createEnemies();
    }

    //pretty self explanatory
    destroyBullet(bullet){
        bullet.destroy();
    }

    destroyLaser(laser){
        laser.destroy();
    }
}