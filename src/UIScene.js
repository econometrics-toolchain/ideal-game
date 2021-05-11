import Healthbar from "./Healthbar";

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true })
    }
    create() {
        this.healthbar = new Healthbar(this, 8, 2, 100)
    }
   
    reset() {
        this.healthbar.updateHealth(100)
    }
}