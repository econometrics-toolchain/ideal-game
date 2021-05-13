import Entity from "./Entity"

export default class Player extends Entity {
    constructor(scene, x, y, textureKey, health, id, damage) {
        super(scene, x, y, textureKey, 'Player')

        this.id = id;
        this.scene = scene;
        this.initialHealth = health;
        this.health = health
        this.facing = this.rotation;
        this.zombiesKilled = 0;
        this.hpRegenTriggered = false;
        this.damage = damage;

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

        const { x, y } = this.body.position

        this.scene.socket.emit('pos', { x, y, rotation: this.rotation })

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

