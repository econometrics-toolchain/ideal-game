import Phaser from 'phaser';
import GameScene from './GameScene';
import UIScene from './UIScene';

window.addEventListener('load', () => {
    let config = {
        type: Phaser.AUTO,
        backgroundColor: '#27ae60',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scale: {
            mode: Phaser.Scale.RESIZE,
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
        this.remainingHealth = data.health;
        this.stage = data.stage;
        this.zombiesKilled = data.zombiesKilled
    }

    preload() {
        this.load.image('button1', 'ui/green_button00.png')
        this.cameras.main.setBackgroundColor(0xcc0000);
    }

    create() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;


        this.add.image(screenCenterX + 40, screenCenterY, 'button1').setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.scene.start('GameScene')
            })

        this.add.text(screenCenterX-30, screenCenterY-15, `play again`, {
            fontSize: '24px',
            fontWeight: 'bold',
            fill: '#ffffff'
        })
        this.add.text(screenCenterX - 100, screenCenterY - 150, `You died`, {
            fontFamily: 'Butcherman',
            fontWeight: 'bold',
            fontSize: '60px',
            fill: '#ffffff'
        })
        this.content = this.add.text(screenCenterX - 30, 10, `stage  ${this.stage}`, {
            fontFamily: 'Butcherman',
            fontWeight: 'bold',
            fontSize: '30px',
            fill: '#ffffff'
        })

    }
    update() {

    }
}