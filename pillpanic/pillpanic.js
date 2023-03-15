var allGameEntities = [];
var catchables;
var throwables;
var particles;
var quotes;
var fog;
var player;
var score = 0;
var target = 25;
var started = false;
var running = true;
var won;

function updateEntities(delta) {
    for (arr of allGameEntities) {
        arr["elements"] = arr["elements"].filter(e => e.active == true);
        for (entity of arr["elements"]) {
            entity.update(delta);
        }
    }
    if (catchables["elements"].length <= 1) {
        createCatchables();
    }
    handleCollisions();
    if (missed >= allowableMisses) {
        running = false;
        won = false;
    }
}

function drawEntities() {
    context.clearRect(0, 0, _WIDTH, _HEIGHT)
    for (arr of allGameEntities) {
        for (entity of arr["elements"]) {
            entity.draw();
        }
    }
}

function createCatchables() {
    let pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let numCreated = 0;
    for (let i = pattern.length - 1; i >= 0; i--) {
        let y = -(pattern.length - i - 1) * (_PILL_HEIGHT + _PILL_VERTICAL_SEPARATOR) - (_PILL_HEIGHT * 1.5);
        for (let j = 0; j < pattern[i].length; j++) {
            if (pattern[i][j] != ' ') {
                catchables["elements"].push(new Catchable(_SPAWN_POINTS[j], y, _PILL_WIDTH, _PILL_HEIGHT, pattern[i][j], _PILL_SPEED));
                throwables["elements"].push(new Throwable(725, 300, _PILL_WIDTH / 3, _PILL_HEIGHT / 3, pattern[i][j], _THROWABLE_SPEED, _SPAWN_POINTS[j], y, numCreated * 20));
                numCreated++;
                if (quotes["elements"].length == 0) {
                    quotes["elements"].push(new Quote());
                }
            }
        }
    }
}

function getPlayer() {
    return player["elements"][0];
}

function handleCollisions() {
    let cachedPlayer = getPlayer();
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
}

let elapsed = 0;
let oldTimeStamp = 0;
window.onload = function () {
    catchables = { elements: [] };
    throwables = { elements: [] };
    particles = { elements: [] };
    quotes = { elements: [] };
    fog = { elements: [new Fog()] };
    player = { elements: [new Player(0, _HEIGHT - _PLAYER_HEIGHT, _PLAYER_WIDTH, _PLAYER_HEIGHT, charImg, _PLAYER_SPEED, _SPEED_MODIFIER)] };
    allGameEntities.push(quotes, throwables, catchables, particles, player, fog);

    function gameLoop(timeStamp) {
        elapsed = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;
        if (!started) {
            drawAndHandleIntro();
        }
        else if (running) {
            updateEntities(elapsed);
            drawEntities();
            drawScore();   
        }
        else {
            drawEndScreen();
        }
        window.requestAnimationFrame(gameLoop);
    }
    window.requestAnimationFrame(gameLoop);
}