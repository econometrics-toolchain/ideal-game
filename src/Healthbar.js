export default class Healthbar {
    constructor(scene, x, y, health) {
        this.scene = scene
        this.currentHealth = health
        this.x = x
        this.y = y

        this.graphics = this.scene.add.graphics()
        this.graphics2 = this.scene.add.graphics()
        this.newGraphics = this.scene.add.graphics()

        this.offsetY = 20;

        const healthbarBackground = new Phaser.Geom.Rectangle(x + 32, y + this.offsetY, 204, 12)
        const healthbarBackground2 = new Phaser.Geom.Rectangle(x + 34, y + this.offsetY + 2, 200, 8)
        const healthbarFill = new Phaser.Geom.Rectangle(x + 34, y + this.offsetY + 2, this.currentHealth*2, 8)

        this.graphics.fillStyle(0xffffff, 0.5)
        this.graphics2.fillStyle(0xff0099, 1)
        this.graphics.fillRectShape(healthbarBackground)
        this.graphics2.fillRectShape(healthbarBackground2)
        this.newGraphics.fillStyle(0x3587e2, 1)
        this.newGraphics.fillRectShape(healthbarFill)

        this.scene.add.text(x, y + this.offsetY - 2, 'HP', { fontSize: '12px', fill: '#fff' })

    }

    updateHealth(health) {
        this.currentHealth = health
        this.newGraphics.clear()
        this.newGraphics.fillStyle(0x3587e2, 1)
        const healthbarFill = new Phaser.Geom.Rectangle(this.x + 34, this.y + this.offsetY + 2, this.currentHealth*2, 8)
        this.newGraphics.fillRectShape(healthbarFill)
    }
}