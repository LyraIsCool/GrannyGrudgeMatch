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
var radialBombCooldownMax = 50;
var radialBombCooldown = 0;
var bulletTimer = 0;
var bulletCooldown = 10;

function updateEntities(delta) {
    let cachedGranny = getGranny();
    for (arr of allGameEntities) {
        arr["elements"] = arr["elements"].filter(e => e.active == true);
        for (entity of arr["elements"]) {
            entity.update(delta);
        }
    }
    handleCollisions();
    /*if (missed >= allowableMisses) {
        running = false;
        won = false;
    }*/
    radialBombCooldown++;
    
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
        let y = -(pattern.length - i - 1) * (_BOMB_HEIGHT + _PILL_VERTICAL_SEPARATOR) - (_BOMB_HEIGHT * 2.5);
        for (let j = 0; j < pattern[i].length; j++) {
            if (pattern[i][j] != ' ') {
                bombs["elements"].push(new Bomb(_SPAWN_POINTS[j], y, _BOMB_WIDTH, _BOMB_HEIGHT, _PILL_SPEED));
                radialBombs["elements"].push(new RadialBomb(granny["elements"][0].middleX(), granny["elements"][0].middleY(), _BOMB_WIDTH, _BOMB_HEIGHT, 600, Math.atan2(getPlayer().middleY() - granny["elements"][0].middleY(), getPlayer().middleX() - granny["elements"][0].middleX()) * 180/Math.PI));
                throwables["elements"].push(new Throwable(granny["elements"][0].middleX(), granny["elements"][0].y, _BOMB_WIDTH / 3, _BOMB_HEIGHT / 3, _THROWABLE_SPEED, _SPAWN_POINTS[j], y, numCreated * 20));
                numCreated++;
            }
        }
    }
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
            let damage = entity.tiny ? 1 : 500;
            cachedGranny.reduceHealth(damage);
        }
    }
    for (entity of radialBombs["elements"]) {
        if (aabbCollision(entity, cachedPlayer)) {
            entity.active = false;
        }
    }
    for (entity of bombs["elements"]) {
        if (aabbCollision(entity, cachedPlayer)) {
            entity.active = false;
        }
    }
}
    /*let cachedPlayer = getPlayer();
    for (entity of catchables["elements"]) {
        if (entity.bottom() >= cachedPlayer.y + 10) {
            if (entity.y <= cachedPlayer.lowerCollisionBound - 10) {
                if (entity.right() >= cachedPlayer.x + 10) {
                    if (entity.x <= cachedPlayer.right() - 10) {
                        entity.active = false;
                        for (let i = 0; i < 3; i++) {
                            particles["elements"].push(new Particles(entity.middleX(), entity.middleY(), entity.type));
                        }
                        if (entity.type == "c") {
                            cachedPlayer.sick = true;
                            cachedPlayer.sickCounter = 0;
                        }
                        else if (entity.type == "s") {
                            score++;
                            if (score >= target) {
                                won = true;
                                running = false;
                                localStorage.setItem(`pillpanic-${difficulty}`, "won");
                            }
                        }
                        else if (entity.type = "p") {
                            won = false;
                            running = false;
                        }
                    }
                }
            }
        }
    }
}

function drawScore() {
    _SCORE_AREA.innerHTML = `Score: ${score} / ${target}`;
    _MISSES_AREA.innerHTML = `Misses allowed: ${allowableMisses - missed}`;
}

function drawEndScreen() {
    if (won) {
        context.drawImage(winImg, 0, 0, _WIDTH, _HEIGHT);
    }
    else {
        context.drawImage(loseImg, 0, 0, _WIDTH, _HEIGHT);
    }
}

function drawAndHandleIntro() {
    context.drawImage(introImg, 0, 0, _WIDTH, _HEIGHT);
    if (left || right) {
        started = true;
    }
}*/

function checkAndCreateBullets() {
    if (bulletTimer <= bulletCooldown) {
        bulletTimer++;
    }
    else {
        if (space) {
            let cachedPlayer = getPlayer();
            let baseSpeed = 750;
            if (right) {
                baseSpeed += cachedPlayer.speed;
            }
            bullets["elements"].push(new Bullet(cachedPlayer.right(), cachedPlayer.middleY(), 10, 10, baseSpeed, cachedPlayer.tiny));
            bulletTimer = 0;
        }
    }
}

function aabbCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y;
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


        updateEntities(elapsed);
        drawEntities();

        /* if (!started) {
            drawAndHandleIntro();
        }
        else if (running) {
            updateEntities(elapsed);
            drawEntities();
            drawScore();   
        }
        else {
            drawEndScreen();
        }*/
        window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(gameLoop);
}