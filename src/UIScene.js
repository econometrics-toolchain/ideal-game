import WebFontFile from "./FontLoader";
import Healthbar from "./Healthbar";
import Navbar from "./Navbar";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true })
    }
    preload() {
        this.load.addFile(new WebFontFile(this.load,
            [
                'Roboto',
                'Butcherman',
            ]));
    }
    create() {
        this.healthbar = new Healthbar(this, 8, 2, 100)
        this.navbar = new Navbar(this, 8, 2)
    }

    reset() {
        this.healthbar.updateHealth(100)
    }
}