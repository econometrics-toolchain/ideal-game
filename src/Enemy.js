import Entity from "./Entity"

export default class Enemy extends Entity {
    constructor(scene, x, y, textureKey, damage, type, speed) {
        super(scene, x, y, textureKey, 'Enemy', type)

        this.textureKey = textureKey
        this.damage = damage
        this.type = type
        this.speed = speed
    }
}