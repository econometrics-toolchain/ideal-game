import Enemy from "./Enemy"
import EnemyFollow from "./EnemyFollow"
import Healthbar from "./Healthbar"
import Player from "./Player"
import { Projectiles } from "./Projectile"


export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    preload() {
        this.cursors
        // this.cameras.main.height = 256
        // this.cameras.main.width = 336
        // this.cameras.main.setPosition(32, 32)
        this.load.image('bullet', 'bullet.png')
        this.load.image('particle', 'particle.png')

        this.load.image('tiles', 'png/Tilesheet/tilesheet_complete.png');
        this.load.tilemapTiledJSON('map', 'png/Tilesheet/map.json');

        // this.load.spritesheet('characters', 'characters.png', {
        //     frameWidth: 16,
        //     frameHieght: 16
        // })

        this.load.atlas('player', ' png/PNG/Man Blue/player1.png', ' png/PNG/Man Blue/player1_atlas.json')

        // this.load.spritesheet('pickups', 'sprites/pickupsSmall.png', {
        //     frameWidth: 16,
        //     frameHieght: 16
        // })

        // this.asload.atlas('tpOnline', 'spritesheetV2.png', 'spritesheetV2.json')
        this.load.atlas('monsters', 'sprites/monsters.png', 'sprites/monsters.json')
        this.player
        this.keys
        this.enemy
        this.enemies
        this.healthbar
        this.projectiles
        this.keys
        this.lastFiredTime = 0
        this.emmiter
    }

    create() {

        const map = this.make.tilemap({
            key: 'map'
        })
        const tileset = map.addTilesetImage("tilesheet_complete", "tiles", 32, 32, 0,);
        const layer1 = map.createStaticLayer('Layer1', tileset, 0, 0);
        // const worldLayer = map.createStaticLayer("floor", tileset, 0, 0);
        // const tileset = map.addTilesetImage('purple', 'tiles')
        // const worldLayer = map.createStaticLayer('world', tileset, 0, 0)
        // const monsterLayer = map.createStaticLayer('monster layer', tileset, 0, 0)

        // worldLayer.setCollisionByProperty({
        //     collides: true
        // })

        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // const debugGraphics = this.add.graphics().setAlpha(0.2)
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(0, 0, 255),
        //     faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        // })



        this.player = new Player(this, 200, 120, 'player', 100).setScale(0.5)
        this.cameras.main.startFollow(this.player, true, 0.8, 0.8)
        this.player.body.setCollideWorldBounds(true)


        this.enemy = new Enemy(this, 250, 200, 'monsters', 20, 'ghost', 10)
        this.enemy.body.setCollideWorldBounds(true)

        this.enemy2 = new EnemyFollow(this, 250, 200, 'monsters', 20, 'slime', 5)
        this.enemy2.body.setCollideWorldBounds(true)
        this.enemy2.setTint(0x00ff00)

        this.enemy3 = new EnemyFollow(this, 250, 200, 'monsters', 20, 'slime', 5)
        this.enemy3.body.setCollideWorldBounds(true)
        this.enemy3.setTint(0x00ff00)

      
        this.enemies = this.add.group()
        this.enemies.add(this.enemy)
        this.enemies.add(this.enemy2)
        this.enemies.add(this.enemy3)
        // this.enemies.add(this.enemy4)
        // this.enemies.add(this.enemy5)



        // monsterLayer.forEachTile(tile => {
        //     if (tile.properties.kind !== undefined) {
        //         const x = tile.getCenterX()
        //         const y = tile.getCenterY()
        //         const e = new Enemy(this, x, y, 'monsters', 10, tile.properties.kind, tile.properties.speed)
        //         this.enemies.add(e)
        //         e.body.setCollideWorldBounds(true)
        //     }
        // })


        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE'
        })
        this.projectiles = new Projectiles(this)

      
        // this.physics.add.collider(this.player, worldLayer)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.collider(this.player, this.coins, this.handlePlayerCoinCollision, null, this)
        this.physics.add.collider(this.player, this.gems, this.handlePlayerGemCollision, null, this)
        // this.physics.add.collider(this.projectiles, worldLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        // this.physics.add.collider(this.enemies, worldLayer)

       
        this.emitter = this.add.particles('particle').createEmitter({
            x: 200,
            y: 200,
            quantity: 15,
            speed: {
                min: -100,
                max: 100
            },
            angle: {
                min: 0,
                max: 360
            },
            scale: {
                start: 1,
                end: 0
            },
            lifespan: 300,
            active: false
        })

    }

   

    handleProjectileWorldCollision(p) {
        this.projectiles.killAndHide(p)
    }
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 30,
                callback: () => {
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
            this.emitter.active = true
            this.emitter.setPosition(enemy.x, enemy.y)
            this.emitter.explode()
        }
    }
    handlePlayerEnemyCollision(p, e) {
        p.health -= e.damage

        let ui = this.scene.get('UIScene')
        ui.healthbar.updateHealth(p.health)
        if (p.health <= 50) {
            this.cameras.main.shake(100, 0.05)
            this.cameras.main.fade(250, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.enemies.children.iterate((child) => {
                    if (child) {
                        child.explode()
                    }
                })
                ui.reset()
                this.scene.stop('UIScene')
                this.scene.start('loseScene', { health: p.health })

            })
        }
        this.cameras.main.shake(40, 0.02)
        p.setTint(0xff0000)
        this.time.addEvent({
            delay: 500,
            callback: () => {
                p.clearTint()
            },
            callbackScope: this,
            loop: false
        })
        e.explode()
    }

    update(time, delta) {
        if (this.keys.space.isDown) {
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 500
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
            }
        }

        this.player.update()

        if (!this.enemy.isDead) {
            this.enemy.update()
        }
        if (!this.enemy2.isDead) {
            this.enemy2.update(this.player.body.position, time)
        }
        if (!this.enemy3.isDead) {
            this.enemy3.update(this.player.body.position, time)
        }
        this.enemies.children.iterate((child) => {
            if (!child.isDead) {
                child.update()
            }
        })
    }


}