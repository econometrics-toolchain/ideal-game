import Entity from "./Entity"

export default class Player extends Entity {
    constructor(scene, x, y, textureKey, health) {
        super(scene, x, y, textureKey, 'Player')

        this.scene = scene;
        this.initialHealth = health;
        this.health = health
        this.facing = this.rotation;
        this.takingDamage = false;
        this.hpRegenTriggered = false;

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
            angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
            this.rotation = angle;
        }, this);
    }


    update() {
        const { keys } = this
        const speed = 250
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
        this._healthRegen();
    }

    _healthRegen() {
        if (this.health < this.initialHealth && !this.takingDamage && !this.hpRegenTriggered) {
            this.hpRegenTriggered = true;
            console.log('health trigger');
            this.scene.time.addEvent({
                delay: 5000,
                callback: () => {
                    let ui = this.scene.scene.get('UIScene')
                    this.health = this.initialHealth;
                    ui.healthbar.updateHealth(this.health)
                    this.hpRegenTriggered = false;

                    console.log('health restored');
                },
                loop: false,
            })
        }
    }

}

