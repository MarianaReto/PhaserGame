import Protagonist from "../models/Protagonist.js"
import Enemy from "../models/Enemy.js"
import Kaboom from "../animations/kaboom.js"

export default class firstScene extends Phaser.Scene {
    constructor() {
        super("FirstScene");
    }

    preload() {
        //tiledmap files
        this.load.image("tiles1", "assets/firstlevel/tileset1.png");
        this.load.image("clouds", "assets/firstlevel/clouds.png");
        this.load.image("far-grounds", "assets/firstlevel/far-grounds.png");
        this.load.image("sea", "assets/firstlevel/sea.png");
        this.load.image("sky", "assets/firstlevel/sky.png");
        this.load.tilemapTiledJSON("firstlevel", "assets/firstlevel/level1.json");

        //tutorial tips
        this.load.image("tip1", "assets/firstlevel/tip1.png");
        this.load.image("tip2", "assets/firstlevel/tip2.png");
        this.load.image("tip3", "assets/firstlevel/tip3.png");
        this.load.image("tip4", "assets/firstlevel/tip4.png");
    }

    create() {
        this.levelHeight = 288;

        this.sound.play("1",{
            loop: true,
            mute: false
        });

        this.createTilemap();
        this.createCharacters();
        this.createCamera();
        this.createTutorialText();
        this.addCollisions();

        //input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time) {
        this.protagonist.update(this.cursors, time);

        //if protagonist falls off tilemap
        if (this.protagonist.y > this.levelHeight)
            this.protagonistDead();

        if (this.protagonist.hp > 0) {
            Phaser.Actions.Call(this.enemiesGroup.getChildren(), function (enemy) {
                enemy.wander();
            }, this);
        }

        //level ended
        if (this.protagonist.x > 730){
            this.sound.stopAll();
            this.scene.start("SecondScene");
        }
    }

    createTilemap() {
        //creating the level
        this.map = this.make.tilemap({ key: "firstlevel" });
        const floorTileset = this.map.addTilesetImage("tileset1", "tiles1");
        const cloudsTileset = this.map.addTilesetImage("clouds", "clouds");
        const farGroundsTileset = this.map.addTilesetImage("far-grounds", "far-grounds");
        const seaTileset = this.map.addTilesetImage("sea", "sea");
        const skyTileset = this.map.addTilesetImage("sky", "sky");


        //creating the layers for the level
        this.map.createStaticLayer("bg1", skyTileset, 0, 0);
        this.map.createStaticLayer("bg2", cloudsTileset);
        this.map.createStaticLayer("bg3", seaTileset, 0, 0);
        this.map.createStaticLayer("bg4", farGroundsTileset, 0, 0);
        this.floor = this.map.createStaticLayer("floor", floorTileset);
        this.map.createStaticLayer("decorations", floorTileset, 0, 0);
    }

    //creates both the protagonist and the enemies
    createCharacters() {
        //creating the protagonist
        this.protagonist = new Protagonist(this, 45, 160);

        //creating enemies
        this.enemiesGroup = this.add.group();
        this.enemies = this.map.filterObjects('objects', (object) => object.type === 'enemy');
        this.createEnemies();
    }

    //makes the camera that follows the main Player
    createCamera() {
        //create camera
        const camera = this.cameras.main;
        camera.startFollow(this.protagonist);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setZoom(4);
    }

    addCollisions() {
        this.floor.setCollisionByProperty({
            "collides": true
        }, true);

        this.floor.setCollisionByExclusion([-1]);

        this.physics.add.collider(this.protagonist, this.floor);
        this.physics.add.collider(this.enemiesGroup, this.floor);
        this.physics.add.collider(this.protagonist, this.enemiesGroup);
        this.physics.add.collider(this.protagonist.bullets, this.floor, this.destroyBullet, null, this);
        this.physics.add.overlap(this.protagonist.bullets, this.enemiesGroup, (bullet, enemy) => {
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

    createTutorialText(){
        this.add.image(60, 200, "tip1").setScale(0.1);
        this.add.image(145, 130, "tip2").setScale(0.1);
        this.add.image(405, 130, "tip3").setScale(0.1);
        this.add.image(700, 130, "tip4").setScale(0.1);
    }


    //creates enemies according to their positions on tiled json
    createEnemies(){
        this.enemies.forEach((enemy) => {
            this.enemy = new Enemy(this, enemy.x, enemy.y); 
            this.enemiesGroup.add(this.enemy);
        });
    }

    //kills all enemies
    killAllEnemies(){
        this.enemies.forEach((enemy) => {
            this.enemy.dead();
        });
    }

    //kills protagonist and resets level
    protagonistDead(){
        this.timer = this.time.addEvent({
            callback: () => {
              this.restartGame()
            },
            callbackScope: this,
            repeat: 0
        });
    }

    //reset level
    restartGame(){
        this.protagonist.setX(30);
        this.protagonist.setY(100);
    }

    //pretty self explanatory
    destroyBullet(bullet){
        bullet.destroy();
    }

    destroyLaser(laser){
        laser.destroy();
    }
}