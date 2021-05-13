export default class CustomButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {

        })
        this.setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {

        })
    }
}