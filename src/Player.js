import Entity from "./Entity"

export default class Player extends Entity {
    constructor(scene, x, y, textureKey, health) {
        super(scene, x, y, textureKey, 'Player')

        this.scene = scene;
        this.health = health
        this.facing = this.rotation;


        const { LEFT, RIGHT, UP, DOWN, W, A, S, D } = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        })

        let angle = 0;

        this.scene.input.on('pointermove', function (pointer) {
            angle = Phaser.Math.Angle.BetweenPoints(this, pointer);
            this.rotation = angle;
        }, this);

    }


    update() {

        const { keys } = this
        const speed = 100
        const previousVelocity = this.body.velocity.clone()
        this.body.setVelocity(0)

        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
        }

        this.body.velocity.normalize().scale(speed);

    }

}

