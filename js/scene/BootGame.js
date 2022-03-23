
//definir 1 classe em js - export default
export default class bootGame extends Phaser.Scene{
    constructor(){
        super("BootGame");
    }
    preload() {
        //backgrounds
        this.load.image("skyline_bg","assets/background/skyline.png");
        this.load.image("space_bg","assets/background/space.png");

        //menus
        this.load.image("play_button", "assets/menu/play.png");
        this.load.image("gameover", "assets/menu/gameoverblood.png");
        this.load.image("restart", "assets/menu/restart.png");
        this.load.image("congratulations", "assets/menu/congratulations.png");
        this.load.image("logo", "assets/menu/logo.png");
        this.load.image("message", "assets/menu/message.png");

        //characters
        this.load.spritesheet("protagonist", "assets/character/boy.png", {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.spritesheet("enemy", "assets/character/enemy.png", {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet("minotaur", "assets/character/minotaur.png", {
            frameWidth: 96,
            frameHeight: 96
        });

        this.load.spritesheet("farrusca", "assets/character/farrusca.png", {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.spritesheet("pandora", "assets/character/pandora.png", {
            frameWidth: 64,
            frameHeight: 64
        });
        
        //visual effects
        this.load.image("bullet", "assets/bullet.png");
        this.load.image("laser", "assets/laser.png");
        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 128,
            frameHeight: 128
        })

        //sfx
        this.load.audio("sfx_damage_hit1", "assets/audio/sfx/damage/sfx_damage_hit1.wav");
        this.load.audio("sfx_damage_hit2", "assets/audio/sfx/damage/sfx_damage_hit2.wav");
        this.load.audio("sfx_damage_hit3", "assets/audio/sfx/damage/sfx_damage_hit3.wav");
        this.load.audio("sfx_damage_hit4", "assets/audio/sfx/damage/sfx_damage_hit4.wav");
        this.load.audio("sfx_damage_hit5", "assets/audio/sfx/damage/sfx_damage_hit5.wav");
        this.load.audio("sfx_damage_hit6", "assets/audio/sfx/damage/sfx_damage_hit6.wav");
        this.load.audio("sfx_damage_hit7", "assets/audio/sfx/damage/sfx_damage_hit7.wav");
        this.load.audio("sfx_damage_hit8", "assets/audio/sfx/damage/sfx_damage_hit8.wav");
        this.load.audio("sfx_damage_hit9", "assets/audio/sfx/damage/sfx_damage_hit9.wav");
        this.load.audio("sfx_damage_hit10", "assets/audio/sfx/damage/sfx_damage_hit10.wav");
        this.load.audio("sfx_deathscream_android1", "assets/audio/sfx/deathscream/sfx_deathscream_android1.wav");
        this.load.audio("sfx_deathscream_android2", "assets/audio/sfx/deathscream/sfx_deathscream_android2.wav");
        this.load.audio("sfx_deathscream_android3", "assets/audio/sfx/deathscream/sfx_deathscream_android3.wav");
        this.load.audio("sfx_deathscream_android4", "assets/audio/sfx/deathscream/sfx_deathscream_android4.wav");
        this.load.audio("sfx_deathscream_android5", "assets/audio/sfx/deathscream/sfx_deathscream_android5.wav");
        this.load.audio("sfx_deathscream_android6", "assets/audio/sfx/deathscream/sfx_deathscream_android6.wav");
        this.load.audio("sfx_deathscream_android7", "assets/audio/sfx/deathscream/sfx_deathscream_android7.wav");
        this.load.audio("sfx_deathscream_android8", "assets/audio/sfx/deathscream/sfx_deathscream_android8.wav");
        this.load.audio("sfx_exp_medium1", "assets/audio/sfx/explosion/sfx_exp_medium1.wav");
        this.load.audio("sfx_exp_medium2", "assets/audio/sfx/explosion/sfx_exp_medium2.wav");
        this.load.audio("sfx_exp_medium3", "assets/audio/sfx/explosion/sfx_exp_medium3.wav");
        this.load.audio("sfx_exp_medium4", "assets/audio/sfx/explosion/sfx_exp_medium4.wav");
        this.load.audio("sfx_exp_medium5", "assets/audio/sfx/explosion/sfx_exp_medium5.wav");
        this.load.audio("sfx_exp_medium6", "assets/audio/sfx/explosion/sfx_exp_medium6.wav");
        this.load.audio("sfx_exp_medium7", "assets/audio/sfx/explosion/sfx_exp_medium7.wav");
        this.load.audio("sfx_exp_medium8", "assets/audio/sfx/explosion/sfx_exp_medium8.wav");
        this.load.audio("sfx_exp_medium9", "assets/audio/sfx/explosion/sfx_exp_medium9.wav");
        this.load.audio("sfx_exp_medium10", "assets/audio/sfx/explosion/sfx_exp_medium10.wav");
        this.load.audio("sfx_exp_medium11", "assets/audio/sfx/explosion/sfx_exp_medium11.wav");
        this.load.audio("sfx_exp_medium12", "assets/audio/sfx/explosion/sfx_exp_medium12.wav");
        this.load.audio("sfx_exp_medium13", "assets/audio/sfx/explosion/sfx_exp_medium13.wav");
        this.load.audio("sfx_movement_footsteps1", "assets/audio/sfx/movement/sfx_movement_footsteps1.wav");
        this.load.audio("sfx_movement_footsteps2", "assets/audio/sfx/movement/sfx_movement_footsteps2.wav");
        this.load.audio("sfx_movement_jump", "assets/audio/sfx/movement/sfx_movement_jump.wav");
        this.load.audio("sfx_movement_falling", "assets/audio/sfx/movement/sfx_sounds_falling.wav");
        this.load.audio("sfx_menu_select1", "assets/audio/sfx/select/sfx_menu_select1.wav");
        this.load.audio("sfx_menu_select2", "assets/audio/sfx/select/sfx_menu_select2.wav");
        this.load.audio("sfx_weapon_shotgun", "assets/audio/sfx/weapon/sfx_weapon_shotgun.wav");
        this.load.audio("sfx_weapon_laser", "assets/audio/sfx/weapon/sfx_weapon_laser.wav");

        //bgm
        this.load.audio("1", "assets/audio/bgm/1.mp3");
        this.load.audio("2", "assets/audio/bgm/2.mp3");
        this.load.audio("3", "assets/audio/bgm/3.mp3");
        this.load.audio("4", "assets/audio/bgm/4.mp3");
        this.load.audio("5", "assets/audio/bgm/5.mp3");
        this.load.audio("6", "assets/audio/bgm/6.mp3");
        
    }
    create(){
        this.scene.start("MenuScene");
    }
}