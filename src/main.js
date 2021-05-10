import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import MainScene from "./MainScene.js";


const config = {
    width: 1280,
    height: 2275,
    backgroundColor: '#333333',
    type: Phaser.AUTO,
    scene: [MainScene],
    antialias: true,
    scale: {
        zoom: 1,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 0 },
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision',
            }
        ],
    },
};

new Phaser.Game(config);
