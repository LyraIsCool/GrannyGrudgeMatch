const context = document.getElementById("canvas").getContext("2d");
const _WIDTH = 1280;
const _HEIGHT = 720;
const _SPAWN_POINTS = [_WIDTH / 6, _WIDTH / 6 * 2, _WIDTH / 6 * 3, _WIDTH / 6 * 4, _WIDTH / 6 * 5];
const _PLAYER_WIDTH = 166;
const _PLAYER_HEIGHT = 186;
const _PLAYER_SPEED = 500;
const _SPEED_MODIFIER = 0.5;
const _THROWABLE_SPEED = 750;
const _FOG_SPEED = 50;
const _PILL_WIDTH = 51;
const _PILL_HEIGHT = 98;
const _PILL_VERTICAL_SEPARATOR = 50;
const _PILL_SPEED = 250;
const _SCORE_AREA = document.getElementById("score");
const _MISSES_AREA = document.getElementById("misses");
const allowableMisses = 3;
var missed = 0;
var patterns;

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
const difficulty = params.difficulty;

if (difficulty == "easy") {
    patterns = easy_patterns;
}
else if (difficulty == "hard") {
    patterns = hard_patterns;
}
else {
    patterns = medium_patterns;
}

var poisonImg = new Image();
poisonImg.src = "poison.png";

var pillsImg = new Image();
pillsImg.src = "pills.png";

var plusImg = new Image();
plusImg.src = "plus.png";

var minusImg = new Image();
minusImg.src = "minus.png";

var charImg = new Image();
charImg.src = "char.png";

var chickenImg = new Image();
chickenImg.src = "chicken.png";

var fogImg = new Image();
fogImg.src = "fog.png";

var winImg = new Image();
winImg.src = "win.png";

var loseImg = new Image();
loseImg.src = "lose.png";

var introImg = new Image();
introImg.src = "rules.png";

var audio = new Audio('CecileChaminade-ArabesqueNo1.mp3');
audio.loop = true;

var quoteImages = [];
for (let i = 1; i < 5; i++) {
    let img = new Image();
    img.src = `speech${i}.png`;
    quoteImages.push(img);
}

const projectileTypes = {
    p: poisonImg,
    s: pillsImg,
    c: chickenImg
};

const particleTypes = {
    p: minusImg,
    s: plusImg,
    c: minusImg
};