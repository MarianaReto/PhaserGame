import Protagonist from "../models/Protagonist.js"
import Farrusca from "../models/Farrusca.js";
import Pandora from "../models/Pandora.js";

export default class bossScene2 extends Phaser.Scene {
    constructor() {
        super("BossScene2");
    }

    preload() {
        //tiledmap files
        this.load.image("radioactive_city", "assets/bosslevel2/radioactive_city.png");
        this.load.image("radioactive_sea", "assets/bosslevel2/radioactive_sea.png");
        this.load.image("tiles5", "assets/bosslevel2/tileset5.png");
        this.load.tilemapTiledJSON("bosslevel2", "assets/bosslevel2/bosslevel2.json");
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createTilemap();
        this.createCharacters();
        this.createCameras();
        this.addCollisions();
        this.createGUI();

        this.sound.play("2",{
            loop: true
        });

        this.levelHeight = 256;
        this.levelWidth = 512;
        this.lives = 3;
        this.xmin = 65;
    }

    //creates the tilemap that was imported from json file
    createTilemap() {
        //creating the level
        this.map = this.make.tilemap({ key: "bosslevel2" });
        const bg1Tileset = this.map.addTilesetImage("radioactive_city", "radioactive_city");
        const bg2Tileset = this.map.addTilesetImage("radioactive_sea", "radioactive_sea");
        const floorTileset = this.map.addTilesetImage("tileset5", "tiles5");

        //creating the layers for the level
        this.map.createStaticLayer("bg1", bg1Tileset, 0, 0);
        this.map.createStaticLayer("bg2", bg2Tileset, 0, 0);
        this.floor = this.map.createStaticLayer("floor", floorTileset, 0, 0);
    }

    //creates both the protagonist and the boss
    createCharacters() {
        this.protagonist = new Protagonist(this, 10, 180);
        this.farrusca = new Farrusca(this, 225, 175);
        this.pandora = new Pandora(this, 300, 175);
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
        this.physics.add.collider(this.protagonist.bullets, this.floor, this.destroyBullet, null, this);
        this.physics.add.collider(this.farrusca, this.floor);
        this.physics.add.collider(this.farrusca, this.protagonist);
        this.physics.add.collider(this.farrusca, this.protagonist.bullets, this.shotFarrusca, null, this);
        this.physics.add.collider(this.pandora, this.floor);
        this.physics.add.collider(this.pandora, this.protagonist);
        this.physics.add.collider(this.pandora, this.farrusca);
        this.physics.add.collider(this.pandora, this.protagonist.bullets, this.shotPandora, null, this);
    }

    createGUI(){
        this.protagonistMaxHP = this.protagonist.hp;
        var px = this.protagonist.x, py = this.protagonist.y;

        this.labelProtagonistHP = this.add.text(px - 10, py - 30, "100%",{
            fill: "#ffffff",
            fontSize: "30 px"
        });

        this.farruscaMaxHP = this.farrusca.hp;
        var fx = this.farrusca.x, fy = this.farrusca.y;
        this.labelFarruscaHP = this.add.text(fx - 13, fy  - 30, "100%",{
            fill: "#ffffff",
            fontSize: "30 px"
        });

        this.pandoraMaxHP = this.pandora.hp;
        var px = this.pandora.x, py = this.pandora.y;
        this.labelPandoraHP = this.add.text(px - 13, py  - 30, "100%",{
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

        this.labelFarruscaHP.x = this.farrusca.x - 13;
        this.labelFarruscaHP.y = this.farrusca.y - 30;
        this.farruscaHealthPercentage = (this.farrusca.hp / this.farruscaMaxHP) * 100;
        this.labelFarruscaHP.setText(this.farruscaHealthPercentage + "%");

        this.labelPandoraHP.x = this.pandora.x - 13;
        this.labelPandoraHP.y = this.pandora.y - 30;
        this.pandoraHealthPercentage = (this.pandora.hp / this.pandoraMaxHP) * 100;
        this.labelPandoraHP.setText(this.pandoraHealthPercentage + "%");
        //console.log("x:"+this.protagonist.x +"y:"+this.protagonist.y);

        if(this.farrusca.hp > 0){
            if(this.protagonist.x > this.xmin)
                this.farrusca.fighting = true;

            if(this.farrusca.fighting == false)
                this.farrusca.idle();
            else{
                var fdx = Math.abs(this.farrusca.x - this.protagonist.x);
                var fdy = Math.abs(this.farrusca.y - this.protagonist.y);
                if (fdx < 20 && fdy < 30){
                    this.farrusca.fight(this.protagonist, time);
                }
                else{
                    this.farrusca.walkTo(this.protagonist);
                }
            }
        }
        else{
            this.farrusca.dead();
        }

        if(this.pandora.hp > 0){
            if(this.protagonist.x > this.xmin)
                this.pandora.fighting = true;

            if(this.pandora.fighting == false)
                this.pandora.idle();
            else{
                var pdx = Math.abs(this.pandora.x - this.protagonist.x);
                var pdy = Math.abs(this.pandora.y - this.protagonist.y);
                if (pdx < 20 && pdy < 30){
                    this.pandora.fight(this.protagonist, time);
                }
                else{
                    this.pandora.walkTo(this.protagonist);
                }
            }
        }
        else{
            this.pandora.dead();
        }

        if(this.farrusca.visible == false && this.pandora.visible == false){
            this.sound.stopAll();         
            this.scene.start("FinalScene");
        }        
        if(this.pandora.fighting == false || this.farrusca.fighting == false)
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

    restartLevel(){
        this.protagonist.setX(10);
        this.protagonist.setY(180);
        this.protagonist.hp = this.protagonistMaxHP;
        this.farrusca.hp = this.farruscaMaxHP;
        this.farrusca.fighting = false;
        this.pandora.hp = this.pandoraMaxHP;
        this.pandora.fighting = false;
    }

    //pretty self explanatory        
    destroyBullet(bullet){
        bullet.destroy();
    }

    shotPandora(pandora, bullets){
        bullets.destroy();
        pandora.hp -= this.protagonist.bulletDamage;
    }  

    shotFarrusca(farrusca, bullets){
        bullets.destroy();
        farrusca.hp -= this.protagonist.bulletDamage;
    }
}