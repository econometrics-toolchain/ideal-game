import Enemy from "./Enemy"

export default class EnemyFollow extends Enemy {
    constructor(scene, x, y, textureKey, damage, type, speed, health) {
        super(scene, x, y, textureKey, 'Enemy', type)

        this.speed = 32
        this.chasing = true
        this.storedTime = 0
        this.damage = damage
        this.scene = scene;
        this.health = health;
        this.setFrame('zoimbie1_hold')
    }

    update(destination, time) {
        const { speed } = this
        const newTime = time
        if (this.chasing) {
            if (newTime > this.storedTime) {
                this.storedTime = newTime + 300
                this.body.setVelocity(0, 0);

                const dx = Math.abs(this.body.x - destination.x)
                const dy = Math.abs(this.body.y - destination.y)

                if (dx > dy) {
                    if (this.body.x < destination.x) {
                        //move right
                        this.body.setVelocity(speed, 0)
                    } else {
                        //move left
                        this.body.setVelocity(-speed, 0)
                    }
                } else {
                    //close y gap
                    if (this.body.y < destination.y) {
                        //move down
                        this.body.setVelocity(0, speed)

                    } else {
                        //move upa
                        this.body.setVelocity(0, -speed)

                    }
                }

                this.body.velocity.normalize().scale(speed)
            }
        }
        let angle = Phaser.Math.Angle.BetweenPoints(this, destination);
        this.rotation = angle;
    }
}
