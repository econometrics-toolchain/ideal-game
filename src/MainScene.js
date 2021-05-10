import Phaser from 'phaser';
import Player from './Player.js';
import background from "./../assets/png/Tilesheet/battle-royale1.json";
import backgroundImg from "./../assets/png/Tilesheet/tilesheet_complete.png";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    init(){
        this.map;
    }

    preload() {
        Player.preload(this);
        this.load.image("tiles", backgroundImg);
        this.load.tilemapTiledJSON("map", background);
    }

    create() {
        this.map = this.make.tilemap({
            key: "map"
        });
        const tileset = this.map.addTilesetImage("battle-royale", "tiles");
        const floorLayer = this.map.createStaticLayer("floor", tileset, 0, 0);
        //const herbeLayer = this.map.createStaticLayer("herbe", tileset, 0, 0);
        this.map["blockLayer"] = this.map.createStaticLayer("block", tileset, 0, 0);
        //this.map["wallLayer"] = this.map.createStaticLayer("wall", tileset, 0, 0);
        this.map["blockLayer"].setCollisionByProperty({
            collide: true
        });

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.player = new Player({ scene: this, x: 50, y: 50, texture: 'person', frame: 'idle_(1)' });
        const keyCode = Phaser.Input.Keyboard.KeyCodes;

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: keyCode.W,
            down: keyCode.S,
            right: keyCode.D,
            left: keyCode.A,
        });

    }
    update() {
        this.player.update();
    }

}