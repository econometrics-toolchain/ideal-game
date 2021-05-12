export default class Navbar {
    constructor(scene, x, y) {
        this.scene = scene
        this.left = 0;
        this.stage = 1;
        this.x = x
        this.y = y

        this.offsetY = 20;

        this.content = this.scene.add.text(0, 0, `stage  ${this.stage}`, {
            fontFamily: 'Butcherman',
            fontWeight: 'bold',
            fontSize: '30px',
            fill: '#ff0000'
        })
        Phaser.Display.Align.In.TopRight(this.content, this.scene.add.zone(400, 300, 800, 600))


    }

    updateContent(stage) {
        // this.left = left;
        this.stage = stage;
        this.content.setText(`stage  ${this.stage}`)

    }
}