import Protagonist from "../models/Protagonist.js"
import Minotaur from "../models/Minotaur.js";

export default class bossScene1 extends Phaser.Scene {
    constructor() {
        super("BossScene1");
    }

    preload() {
        //tiledmap files
        this.load.image("mountains1", "assets/bosslevel1/mountains_1.png");
        this.load.image("mountains2", "assets/bosslevel1/mountains_2.png");
        this.load.image("sky2", "assets/bosslevel1/sky2.png");
        this.load.image("tiles4", "assets/bosslevel1/tileset4.png");
        this.load.tilemapTiledJSON("bosslevel1", "assets/bosslevel1/bosslevel1.json");
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createTilemap();
        this.createCharacters();
        this.createCameras();
        this.addCollisions();
        this.createGUI();

        this.sound.play("3",{
            loop: true
        });

        this.levelHeight = 256;
        this.levelWidth = 512;
        this.lives = 3;
        this.acidDamage = 10;
        this.acidHeight = 225;
        this.acidDamageTime = 50;
        this.timeInAcid = 0;
    }

    //creates the tilemap that was imported from json file
    createTilemap() {
        //creating the level
        this.map = this.make.tilemap({ key: "bosslevel1" });
        const bg1Tileset = this.map.addTilesetImage("sky2", "sky2");
        const bg2Tileset = this.map.addTilesetImage("mountains_1", "mountains1");
        const bg3Tileset = this.map.addTilesetImage("mountains_2", "mountains2");
        const floorTileset = this.map.addTilesetImage("tileset4", "tiles4");
        
        //creating the layers for the level
        this.map.createStaticLayer("bg1", bg1Tileset, 0, 0);
        this.map.createStaticLayer("bg2", bg2Tileset, 0, 0);
        this.map.createStaticLayer("bg3", bg3Tileset, 0, 0);
        this.map.createStaticLayer("acid", floorTileset, 0, 0);
        this.map.createStaticLayer("decorations1", floorTileset, 0, 0);
        this.floor = this.map.createStaticLayer("floor", floorTileset, 0, 0);
        this.map.createStaticLayer("decorations2", floorTileset, 0, 0);

    }

    //creates both the protagonist and the boss
    createCharacters() {
        this.protagonist = new Protagonist(this, 10, 180);
        this.minotaur = new Minotaur(this, 225, 175);
    }

    //makes the camera that follows the main Player
    createCameras(){
        const camera = this.cameras.main;
        camera.startFollow(this.protagonist);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setZoom(3.6);
    }

    addCollisions(){
        this.floor.setCollisionByProperty({
            "collides": true
        }, true);

        this.floor.setCollisionByExclusion([-1]);

        this.physics.add.collider(this.protagonist, this.floor);
        this.physics.add.collider(this.minotaur, this.floor);   
        this.physics.add.collider(this.minotaur, this.protagonist);   

        this.physics.add.collider(this.protagonist.bullets, this.floor, this.destroyBullet, null, this);
        this.physics.add.collider(this.protagonist.bullets, this.minotaur, this.shotMinotaur, null, this);
    }

    createGUI(){
        this.protagonistMaxHP = this.protagonist.hp;
        var px = this.protagonist.x, py = this.protagonist.y;

        this.labelProtagonistHP = this.add.text(px - 10, py - 30, "100%",{
            fill: "#ffffff",
            fontSize: "30 px"
        });

        this.minotaurMaxHP = this.minotaur.hp;
        var mx = this.minotaur.x, my= this.minotaur.y;
        this.labelMinotaurHP = this.add.text(mx - 10, my - 50, "100%",{
            fill: "#ffffff",
            fontSize: "30 px"
        });
    }

    
    update(time) {
        if(this.protagonist.x < this.levelWidth || this.protagonist.y < this.levelWidth)
            this.protagonist.update(this.cursors, time);

        if(this.protagonist.y > this.levelHeight || this.protagonist.hp <= 0){
            this.protagonistDead();
        }


        /**
         * Updating health labels
         */
        this.labelProtagonistHP.x = this.protagonist.x - 10;
        this.labelProtagonistHP.y = this.protagonist.y - 30;
        this.protagonistHealthPercentage = (this.protagonist.hp / this.protagonistMaxHP) * 100;
        this.labelProtagonistHP.setText(this.protagonistHealthPercentage + "%");

        this.labelMinotaurHP.x = this.minotaur.x - 10;
        this.labelMinotaurHP.y = this.minotaur.y - 50;
        this.minotaurHealthPercentage = (this.minotaur.hp / this.minotaurMaxHP) * 100;
        this.labelMinotaurHP.setText(this.minotaurHealthPercentage + "%");

        //console.log("x: "+this.protagonist.x+" y: "+this.protagonist.y);


        //hp decreases every this.acidDamageTime in milliseconds
        if(this.protagonist.y >= this.acidHeight && time > this.timeInAcid && this.protagonist.hp > 0){            
            this.protagonist.removeHP(this.acidDamage);
            this.timeInAcid = time + this.acidDamageTime;
        }

        if(this.minotaur.hp > 0){ 
            if(this.protagonist.x > 50)
                this.minotaur.fighting = true;

            if (this.minotaur.fighting == false)
                this.minotaur.idle();
            else{
                if(this.minotaur.protagonistOutsidePlatform(80, 430, this.protagonist))
                    this.minotaur.taunt();
                else{
                    //distance to player
                    var dx = Math.abs(this.minotaur.x - this.protagonist.x);
                    var dy = Math.abs(this.minotaur.y - this.protagonist.y);

                    if(dx < 35 && dy < 30){
                        this.minotaur.fight(this.protagonist, time);
                    }
                    else{
                        this.minotaur.runTo(80, 430, this.protagonist);
                    }
                }
            }
        }
        else{
            this.minotaur.dead();
        }
        if(this.minotaur.visible == false){
            this.sound.stopAll();
            this.scene.start("ThirdScene");
        }

        if(this.protagonist.x < 80 || this.protagonist.x > 430)
            this.protagonist.canShoot = false;
        else
            this.protagonist.canShoot = true;
    }

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
            this.protagonist.hp = this.protagonistMaxHP;
        }
    }

    shotMinotaur(minotaur, bullets){
        bullets.destroy();
        this.minotaur.hp -= this.protagonist.bulletDamage;
    }

    restartLevel(){
        this.protagonist.setX(10);
        this.protagonist.setY(180);
        this.protagonist.hp = this.protagonistMaxHP;
        this.minotaur.hp = this.minotaurMaxHP;
        this.minotaur.fighting = false;
    }

    //pretty self explanatory        
    destroyBullet(bullet){
        bullet.destroy();
    }
}