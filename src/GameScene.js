import Enemy from "./Enemy"
import EnemyFollow from "./EnemyFollow"
import WebFontFile from "./FontLoader"
import Healthbar from "./Healthbar"
import Player from "./Player"
import { Projectiles } from "./Projectile"
import { startStage } from "./Stage"
import io from 'socket.io-client';
import { NONE } from "phaser"

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    _loadAssets() {
        this.load.image('bullet', 'bullet.png')
        this.load.image('particle', 'particle.png')
        this.load.image('tiles', 'Tilesheet/tilesheet_complete.png');
        this.load.tilemapTiledJSON('map', 'Tilesheet/map.json');
        this.load.atlas('player', ' sprites/Man Blue/player1.png', ' sprites/Man Blue/player1_atlas.json');
        this.load.atlas('monsters', 'sprites/Zombie 1/zombie.png', 'sprites/Zombie 1/zombie_atlas.json');
    }

    _collisions(collisionLayer, bulletCollision) {
        this.physics.add.collider(this.playersGroup, collisionLayer);
        this.physics.add.collider(this.enemies, collisionLayer, this.handleEnemyWorldCollision, null, this);
        this.physics.add.collider(this.projectiles, collisionLayer, this.handleProjectileWorldCollision, null, this);
        this.physics.add.collider(this.enemyProjectiles, collisionLayer, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.collider(this.enemyProjectiles, bulletCollision, this.handleProjectileWorldCollision, null, this)
        this.physics.add.collider(this.projectiles, bulletCollision, this.handleProjectileWorldCollision, null, this)
    }

    _layers() {
        const map = this.make.tilemap({
            key: 'map'
        })
        const tileset = map.addTilesetImage("tilesheet_complete", "tiles", 32, 32, 0,);
        const floorLayer = map.createStaticLayer('Layer1', tileset, 0, 0);
        const collisionLayer = map.createStaticLayer('extraLayer', tileset, 0, 0);
        const helperLayer = map.createStaticLayer('helperLayer', tileset, 0, 0);
        const bulletCollision = map.createStaticLayer('bulletcollision', tileset, 0, 0);

        bulletCollision.setCollisionByProperty({ collide: true });
        collisionLayer.setCollisionByProperty({ collide: true });

        return { map, collisionLayer, bulletCollision };
    }

    preload() {
        this._loadAssets()
        this.cursors
        this.mainPlayer
        this.keys
        this.enemy
        this.enemies
        this.healthbar
        this.projectiles
        this.enemyProjectiles
        this.keys
        this.lastFiredTime = 0
        this.emmiter
        this.currentStage = 0;
        this.stageEnded = true;
        this.zombiesToKill = 0;
        this.playersGroup;
        this.players = []
        this.socket = io('https://game-server.cukierpo2zl.repl.co', { transports: ['websocket'] });

    }

    create() {
        const { map, collisionLayer, bulletCollision } = this._layers()

        this.physics.world.bounds.width = map.widthInPixels
        this.physics.world.bounds.height = map.heightInPixels
        this.enemies = this.add.group();
        this.playersGroup = this.add.group();
        this.projectiles = new Projectiles(this);
        this.enemyProjectiles = new Projectiles(this);


        this.socket.on('joined', data => {
            const [id, pos] = data;

            if (!(id in this.players)) {

                const player = new Player(this, pos.x, pos.y, 'player', 100, id, 25).setTint(0x696969)
                player.body.setCollideWorldBounds(true)
                this.playersGroup.add(player)

                if (!this.mainPlayer) {
                    player.clearTint()
                    this.mainPlayer = player
                    this.setupMainPlayer()
                }
                this.players.push(id);
            }
        })

        this.socket.on('pos', d => {
            const [id, pos] = d;
            this.playersGroup.children.iterate(p => {
                if (p.id === id && p !== this.mainPlayer) {
                    p.setPosition(pos.x, pos.y)
                    p.rotation = pos.rotation;
                }

            })
        })


        this.emitter = this.add.particles('particle').createEmitter({
            x: 200,
            y: 200,
            quantity: 15,
            swpeed: {
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

        this._collisions(collisionLayer, bulletCollision);

    }

    setupMainPlayer() {
        this.cameras.main.startFollow(this.mainPlayer, true, 0.8, 0.8)
        this.physics.add.overlap(this.mainPlayer, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.mainPlayer, this.enemyProjectiles, this.handlePlayerProjectileCollision, null, this)

        this.input.on('pointermove', function (pointer) {
            let angle = Phaser.Math.Angle.Between(this.mainPlayer.x, this.mainPlayer.y, pointer.worldX, pointer.worldY);
            this.mainPlayer.rotation = angle;
            const { x, y } = this.mainPlayer.body.position
            this.socket.emit('pos', { x, y, rotation: angle })
        }, this);
    }

    handleEnemyWorldCollision(p) {
        p.body.setVelocity((30), (40))
    }
    handleProjectileWorldCollision(p) {
        this.projectiles.killAndHide(p);
        // p.recycle()
    }

    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            enemy.body.setVelocity(projectile.body.velocity.x, projectile.body.velocity.y)
            projectile.recycle()
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    enemy.health -= this.mainPlayer.damage
                    if (enemy.health <= 0) {
                        this.time.addEvent({
                            delay: 300,
                            callback: () => {
                                enemy.setTint(0x000000)
                                enemy.explode()
                            },
                            callbackScope: this,
                            loop: false
                        })
                    }
                },
                callbackScope: this,
                loop: false
            })

            this.time.addEvent({
                delay: 500,
                callback: () => {
                    enemy.clearTint()
                },
                callbackScope: this,
                loop: false
            })
        }
        this.mainPlayer.zombiesKilled += 1;
        this.emitter.active = true
        this.emitter.setPosition(enemy.x, enemy.y)
        this.emitter.explode()
    }

    handlePlayerEnemyCollision(p, e) {
        if (e.canAttack) {
            e.canAttack = false;
            p.takingDamage = true;
            p.health -= e.damage
            e.body.setVelocity(-(e.body.velocity.x) * 2, -(e.body.velocity.y) * 2);

            let ui = this.scene.get('UIScene')
            ui.healthbar.updateHealth(p.health)

            if (p.health <= 0) {
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
                    this.scene.start('loseScene', { health: p.health, stage: this.currentStage, zombiesKilled: this.mainPlayer.zombiesKilled })
                })
            }

            this.cameras.main.shake(40, 0.02)
            p.setTint(0xff0000)
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    p.clearTint()
                    e.canAttack = true
                    p.takingDamage = false;
                },
                callbackScope: this,
                loop: false
            })
        }
        return;
    }


    handlePlayerProjectileCollision(player, projectile) {
        if (projectile.active) {
            projectile.recycle()

            player.takingDamage = true;
            player.health -= 15

            let ui = this.scene.get('UIScene')
            ui.healthbar.updateHealth(player.health)

            if (player.health <= 0) {
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
                    this.scene.start('loseScene', { health: player.health })
                })
            }

            this.cameras.main.shake(40, 0.02)
            player.setTint(0xff0000)
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    player.clearTint()
                    player.takingDamage = false;
                },
                callbackScope: this,
                loop: false
            })
        }
    }
    update(time, delta) {
        if (this.stageEnded) {
            this.stageEnded = false;
            this.currentStage += 1;
            this.zombiesToKill = startStage(this, this.currentStage);

            let ui = this.scene.get('UIScene')
            if (ui) {
                ui.navbar?.updateContent(this.currentStage)
            }
        }

        if (!this.stageEnded && this.enemies.children.entries.length === 0) {
            this.stageEnded = true;
        }


        if (this.mainPlayer) {
            if (this.input.activePointer.isDown) {

                if (time > this.lastFiredTime) {
                    this.lastFiredTime = time + 100
                    this.projectiles.fireProjectile(this.mainPlayer.x, this.mainPlayer.y, this.mainPlayer.rotation)
                }
            }
            this.mainPlayer.update()
            this.enemies.children.iterate((child) => {
                if (!child.isDead) {
                    child.update(this.mainPlayer.body.position, time)
                }
            })


            this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.enemies.children.each((child, idx) => {
                        if (child.canShoot) {
                            this.enemyProjectiles.fireProjectile(child.x, child.y, child.rotation)
                            child.canShoot = false;
                            this.time.addEvent({
                                delay: 5000,
                                callback: () => {
                                    child.canShoot = true;
                                }
                            })
                        }
                    }
                    )
                }
            })
        }
    }
}