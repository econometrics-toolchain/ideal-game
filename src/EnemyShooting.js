import EnemyFollow from './EnemyFollow'

export default class EnemyShooting extends EnemyFollow {
    constructor(scene, x, y, textureKey, damage, type, speed,health) {
        super(scene, x, y, textureKey, 'Enemy', type)

        this.speed = speed
        this.chasing = true
        this.storedTime = 0
        this.damage = damage
        this.scene = scene;
        this.health = health;
        this.canShoot = true;

        this.setFrame('zoimbie1_gun')
    }

}