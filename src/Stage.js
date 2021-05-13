import EnemyFollow from "./EnemyFollow";
import EnemyShooting from "./EnemyShooting";


const SPAWNS = [
    { x: 270, y: 250 },
    { x: 270, y: 1050 },
    { x: 1050, y: 250 },
    { x: 1050, y: 1050 },
];

export const startStage = (scene, noStage) => {

    const zombiesCount = noStage * 10
    const activeSpawns = (noStage < 4) ? noStage : 4

    const defaultEmenyCount = zombiesCount / activeSpawns
    const shootingEnemiesCount = noStage - 2

    for (let j = 0; j < activeSpawns; j++) {
        const spawn = SPAWNS[j];

        generateDefaultEnemy(scene, spawn, defaultEmenyCount);

        if (activeSpawns > 2) {
            generateShootingEnemy(scene, spawn, shootingEnemiesCount);
        }

        if (noStage % 5 === 0) {
            generateBossEnemy(scene, spawn, 1)
        }
    }

    return 0;
}

function addColisions(scene, enemy) {
    enemy.body.setCollideWorldBounds(true);
    scene.physics.add.collider(enemy, scene.enemies, scene.handleCollisionEnemyEnemy, null, scene);
    scene.enemies.add(enemy);
}

function generateDefaultEnemy(scene, spawn, count) {
    for (let i = 0; i < count; i++) {
        const enemy = new EnemyFollow(scene, spawn.x + i * 30, spawn.y + i * 30, 'monsters', 10, 'zombie', 5, 50);
        addColisions(scene, enemy);
    }
}

function generateShootingEnemy(scene, spawn, count) {
    for (let i = 0; i < count; i++) {
        const enemy = new EnemyShooting(scene, spawn.x + i * 3 * 30, spawn.y + 10 * 30, "monsters", 10, "zombie", 32, 50);
        addColisions(scene, enemy);
    }
}

function generateBossEnemy(scene, spawn, count) {
    for (let i = 0; i < count; i++) {
        const enemy = new EnemyFollow(scene, spawn.x + i * 50, spawn.y + i * 50, "monsters", 25, "zombie", 70, 250);
        enemy.setScale(2);
        enemy.setTint(0x6ffc03);
        addColisions(scene, enemy);
    }
}