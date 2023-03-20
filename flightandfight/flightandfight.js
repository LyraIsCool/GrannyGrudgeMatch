var allGameEntities = [];
var bombs;
var throwables;
var particles;
var quotes;
var parallaxEntities;
var player;
var granny;
var radialBombs;
var bullets;
var score = 0;
var target = 25;
var started = false;
var running = true;
var won;
var radialBombFlipFlop = true;
var radialBombCooldownMax;
var radialBombCooldown = 0;
var bulletTimer = 0;
var bulletCooldown = 10;

if (difficulty == "easy") {
    radialBombCooldownMax = 75;
}
else if (difficulty == "hard") {
    radialBombCooldownMax = 35;
}
else {
    radialBombCooldownMax = 50;
}

function updateEntities(delta) {
    let cachedGranny = getGranny();
    for (arr of allGameEntities) {
        arr["elements"] = arr["elements"].filter(e => e.active == true);
        for (entity of arr["elements"]) {
            entity.update(delta);
        }
    }
    handleCollisions();
    if (player["elements"][0].hp <= 0) {
        running = false;
        won = false;
    }
    radialBombCooldown++;
    if (cachedGranny.health <= 0) {
        running = false;
        won = true;
        localStorage.setItem(`flightandfight-${difficulty}`, "won");
    }
    if (cachedGranny.phase == 1) {
        if (bombs["elements"].length <= 1) {
            createBombs();
        }
    }
    else if (cachedGranny.phase == 2) {
        if (radialBombCooldown >= radialBombCooldownMax && !cachedGranny.moving) {
            createRadialBombs();
            radialBombCooldown = 0;
        }
    }
    else {
        if (bombs["elements"].length <= 1 && !cachedGranny.radialAttack) {
            createBombs();
        }
        if (radialBombCooldown >= radialBombCooldownMax && cachedGranny.radialAttack && !cachedGranny.moving) {
            createRadialBombs();
            radialBombCooldown = 0;
        }
    }
    checkAndCreateBullets();
}

function drawEntities() {
    context.clearRect(0, 0, _WIDTH, _HEIGHT)
    for (arr of allGameEntities) {
        for (entity of arr["elements"]) {
            entity.draw();
        }
    }
}

function createBombs() {
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let numCreated = 0;
    for (let i = pattern.length - 1; i >= 0; i--) {
        let y = -(pattern.length - i - 1) * (_BOMB_HEIGHT + _PILL_VERTICAL_SEPARATOR) - _BOMB_HEIGHT - 300;
        for (let j = 0; j < pattern[i].length; j++) {
            if (pattern[i][j] != ' ') {
                bombs["elements"].push(new Bomb(_SPAWN_POINTS[j], y, _BOMB_WIDTH, _BOMB_HEIGHT, _PILL_SPEED));
                throwables["elements"].push(new Throwable(granny["elements"][0].middleX(), granny["elements"][0].y, _BOMB_WIDTH / 3, _BOMB_HEIGHT / 3, _THROWABLE_SPEED, _SPAWN_POINTS[j], y, 0));
                numCreated++;
            }
        }
    }
    radialBombs["elements"].push(new RadialBomb(granny["elements"][0].middleX(), granny["elements"][0].middleY(), _BOMB_WIDTH, _BOMB_HEIGHT, 600, Math.atan2(getPlayer().middleY() - granny["elements"][0].middleY(), getPlayer().middleX() - granny["elements"][0].middleX()) * 180/Math.PI));
}

function createRadialBombs() {
    let numCreated = 0;
    let angle = 30;
    let num = 360 / angle;
    let offsetAngle = angle / 2;
    for (let i = 0; i < num; i++) {
        let thisBombsAngle = 0;
        if (radialBombFlipFlop) {
            thisBombsAngle = offsetAngle + (i * angle);
        }
        else {
            thisBombsAngle = i * angle;
        }
        radialBombs["elements"].push(new RadialBomb(granny["elements"][0].middleX(), granny["elements"][0].middleY(), _BOMB_WIDTH, _BOMB_HEIGHT, 200, thisBombsAngle));
        numCreated++;
    }
    radialBombFlipFlop = !radialBombFlipFlop;
}

function getPlayer() {
    return player["elements"][0];
}

function getGranny() {
    return granny["elements"][0];
}

function handleCollisions() {
    let cachedGranny = getGranny();
    let cachedPlayer = getPlayer();
    for (entity of bullets["elements"]) {
        if (aabbCollision(entity, cachedGranny)) {
            entity.active = false;
            let damage = entity.tiny ? 5 : 10;
            cachedGranny.reduceHealth(damage);
        }
    }
    for (entity of radialBombs["elements"]) {
        if (aabbCollision(entity, cachedPlayer)) {
            entity.active = false;
            cachedPlayer.reduceHealth();
        }
    }
    for (entity of bombs["elements"]) {
        if (aabbCollision(entity, cachedPlayer)) {
            entity.active = false;
            cachedPlayer.reduceHealth();
        }
    }
    if (aabbCollision(cachedGranny, cachedPlayer)) {
        cachedPlayer.kill();
    }
}

function drawEndScreen() {
    if (won) {
        context.drawImage(winImage, 0, 0, _WIDTH, _HEIGHT);
    }
    else {
        context.drawImage(loseImage, 0, 0, _WIDTH, _HEIGHT);
    }
}

function drawAndHandleIntro() {
    context.drawImage(introImage, 0, 0, _WIDTH, _HEIGHT);
    if (left || right || up || down || space || control) {
        started = true;
        audio.play();
    }
}

function checkAndCreateBullets() {
    if (bulletTimer <= bulletCooldown) {
        bulletTimer++;
    }
    else {
        if (space) {
            let cachedPlayer = getPlayer();
            let baseSpeed = 750;
            bullets["elements"].push(new Bullet(cachedPlayer.right(), cachedPlayer.middleY(), 30, 10, baseSpeed, cachedPlayer.tiny));
            bulletTimer = 0;
        }
    }
}

function aabbCollision(obj1, obj2) {
    return obj1.collisionX < obj2.collisionX + obj2.collisionWidth &&
        obj1.collisionX + obj1.collisionWidth > obj2.collisionX &&
        obj1.collisionY < obj2.collisionY + obj2.collisionHeight &&
        obj1.collisionHeight + obj1.collisionY > obj2.collisionY;
}

let elapsed = 0;
let oldTimeStamp = 0;
window.onload = function () {
    player = { elements: [new Player(100, 100, 140, 114, playerImage, 8, _PLAYER_SPEED)] };
    granny = { elements: [new Granny(500, 400, 140, 204, grannyImage, 7, 250)] };
    bombs = { elements: [] };
    throwables = { elements: [] };
    radialBombs = { elements: [] };
    bullets = { elements: [] };
    parallaxEntities = { elements: [new ParallaxEntities()] };
    allGameEntities.push(parallaxEntities, throwables, granny, bombs, radialBombs, bullets, player);

    function gameLoop(timeStamp) {
        elapsed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        if (!started) {
            drawAndHandleIntro();
        }
        else if (running) {
            updateEntities(elapsed);
            drawEntities();
        }
        else {
            drawEndScreen();
        }
        window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(gameLoop);
}