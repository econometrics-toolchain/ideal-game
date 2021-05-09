import Phaser from 'phaser';
import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        Player.preload(this);
    }

    create() {
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