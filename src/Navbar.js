export default class Navbar {
    constructor(scene, x, y) {
        this.scene = scene
        this.left = 0;
        this.stage = 1;
        this.x = x
        this.y = y

        this.offsetY = 20;
        const screenCenterX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;

        this.content = this.scene.add.text(screenCenterX, 10, `stage  ${this.stage}`, {
            fontFamily: 'Butcherman',
            fontWeight: 'bold',
            fontSize: '30px',
            fill: '#ff0000'
        })

        



    }

    updateContent(stage) {
        // this.left = left;
        this.stage = stage;
        this.content.setText(`stage  ${this.stage}`)

    }
}