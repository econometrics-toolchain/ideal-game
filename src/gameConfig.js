import Phaser from 'phaser';
import GameScene from './GameScene';
import UIScene from './UIScene';

window.addEventListener('load', () => {
    let config = {
        type: Phaser.AUTO,
        // width: 400,
        // height: 320,
        // backgroundColor: 0x220283,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame"
        },
        scene: [GameScene, UIScene, LoseScene]
    }
    const game = new Phaser.Game(config)
})




class TitleScene extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    preload() {

    }

    create() {

    }

    update() {

    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super('winScene')
    }

    preload() {

    }

    create() {

    }
    update() {

    }
}

class LoseScene extends Phaser.Scene {
    constructor() {
        super('loseScene')
    }
    init(data) {
        this.remainingHealth = data.health
        console.log(this.remainingHealth);
    }

    preload() {
        this.cameras.main.setBackgroundColor(0xcc0000)
    }

    create() {

    }
    update() {

    }
}