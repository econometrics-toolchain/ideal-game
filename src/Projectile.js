
export class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        this.scene = scene;
        this.x = 200
        this.y = 200
        
    }

    fire(x, y, dir) {
        this.body.reset(x, y)
        this.setActive(true)
        this.setVisible(true)
        this.rotation = dir;
        this.scene.physics.velocityFromRotation(dir, 500, this.body.velocity)
        return;
    }
    
    recycle() {
        this.setActive(false)
        this.setVisible(false)
    }
}

export class Projectiles extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene)
        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Projectile
        })
    }
    fireProjectile(x, y, facing) {
        let projectile = this.getFirstDead(false)
        if (projectile) {
            projectile.fire(x, y, facing)
        }
    }
}

