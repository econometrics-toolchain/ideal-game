import EnemyFollow from "./EnemyFollow";


const SPAWNS = [
    { x: 270, y: 250 },
    { x: 270, y: 1050 },
    { x: 1050, y: 250 },
    { x: 1050, y: 1050 },
]
export const startStage = (scene, noStage) => {

    const zombiesCount = noStage * 10
    const activeSpawns = (noStage < 4) ? noStage : 4

    for (let j = 0; j < activeSpawns; j++) {
        const spawn = SPAWNS[j];
        for (let i = 0; i < zombiesCount / activeSpawns; i++) {
            const enemy = new EnemyFollow(scene, spawn.x + i * 30, spawn.y + i * 30, 'monsters', 10, 'zombie', 5);
            enemy.body.setCollideWorldBounds(true);
            scene.physics.add.collider(enemy, scene.enemies, scene.handleCollisionEnemyEnemy, null, scene)
            scene.enemies.add(enemy);
        }
    }
    console.log({ z: zombiesCount, a: activeSpawns });


    return zombiesCount;

}