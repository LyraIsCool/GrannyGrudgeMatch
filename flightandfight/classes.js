class GameObject {
    constructor(x, y, width, height, image, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.speed = speed;
        this.active = true;
        this.visible = true;
        this.collisionWidth = width;
        this.collisionHeight = height;
    }

    draw() {
        if (this.visible) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.collisionX = this.x;
        this.collisionY = this.y;
    }

    right() {
        return this.x + this.width;
    }

    bottom() {
        return this.y + this.height;
    }

    middleX() {
        return this.x + (this.width / 2);
    }

    middleY() {
        return this.y + (this.height / 2);
    }
}

class AnimatedGameObject extends GameObject {
    constructor(x, y, width, height, image, numFrames, speed) {
        super(x, y, width, height, image, speed)
        this.active = true;
        this.visible = true;
        this.frames = numFrames;
        this.frameWidth = image.width / numFrames;
        this.currFrame = 0;
        this.maxFrameTime = 5;
        this.currFrameTimer = 0;
    }

    update() {
        super.update();
        this.currFrameTimer++;
        if (this.currFrameTimer >= this.maxFrameTime) {
            this.currFrameTimer = 0;
            this.currFrame = this.currFrame < this.frames - 1 ? this.currFrame + 1 : 0;
        }
    }

    draw() {
        if (this.visible) {
            context.drawImage(this.image, this.frameWidth * this.currFrame, 0, this.frameWidth, this.image.height, this.x, this.y, this.width, this.height);
        }
    }
}

class Player extends AnimatedGameObject {
    constructor(x, y, width, height, image, numFrames, speed) {
        super(x, y, width, height, image, numFrames, speed);
        this.initialWidth = width;
        this.initialHeight = height;
        this.initialSpeed = speed;
        this.tiny = false;
        this.hp = 3;
        this.collisionDeadzone = 20;
    }

    update(delta) {
        super.update();
        this.collisionX = this.x + this.collisionDeadzone;
        this.collisionY = this.y + this.collisionDeadzone;
        this.collisionWidth = this.width - (this.collisionDeadzone * 2);
        this.collisionHeight = this.height - (this.collisionDeadzone * 2);
        if (control && this.width == this.initialWidth) {
            this.width = this.initialWidth / 2;
            this.height = this.initialHeight / 2;
            this.speed = this.initialSpeed * 1.5;
            this.tiny = true;
            this.collisionDeadzone = 10;
        }
        else if (!control && this.width != this.initialWidth) {
            this.width = this.initialWidth;
            this.height = this.initialHeight;
            this.speed = this.initialSpeed;
            this.tiny = false;
            this.collisionDeadzone = 20;
        }
        if (left && this.x > 0) {
            this.x -= this.speed * delta;
        }
        if (right && this.right() < _WIDTH) {
            this.x += this.speed * delta;
        }
        if (up && this.y > 0) {
            this.y -= this.speed * delta;
        }
        if (down && this.bottom() < _HEIGHT) {
            this.y += this.speed * delta;
        }
    }

    draw() {
        super.draw();
        for (let i = 0; i < this.hp; i++) {
            context.drawImage(heartImage, (i * 25) + 10, 0, 25, 25);
        }
    }

    reduceHealth() {
        this.hp--;
    }

    kill() {
        this.hp = 0;
    }
}

class Granny extends AnimatedGameObject {
    constructor(x, y, width, height, image, numFrames, speed) {
        super(x, y, width, height, image, numFrames, speed);
        this.topLeft = [0, 50];
        this.topMiddle = [(_WIDTH / 2) - (this.width / 2), 50];
        this.topRight = [_WIDTH - this.width, 50];
        this.centreLeft = [0, (_HEIGHT / 2) - (this.height / 2)];
        this.centreMiddle = [(_WIDTH / 2) - (this.width / 2), (_HEIGHT / 2) - (this.height / 2)];
        this.centreRight = [_WIDTH - this.width, (_HEIGHT / 2) - (this.height / 2)];
        this.bottomLeft = [0, _HEIGHT - this.height];
        this.bottomMiddle = [(_WIDTH / 2) - (this.width / 2), _HEIGHT - this.height];
        this.bottomRight = [_WIDTH - this.width, _HEIGHT - this.height];
        this.nodes = [this.topLeft, this.topMiddle, this.topRight, this.centreLeft, this.centreMiddle, this.centreRight, this.bottomLeft, this.bottomMiddle, this.bottomRight];
        this.x = this.centreRight[0];
        this.y = this.centreRight[1];
        this.hasLocation = false;
        this.sin = 0;
        this.cos = 0;
        this.movementAngle;
        this.prevLocation = -1;
        this.epsilon = 5;
        this.movementSleepTimer = 0;
        this.movementSleepMax = 300;
        this.moving = false;
        this.radialAttack = false;
        this.health = 3000;
        this.prevHealth = this.health;
        this.phase = 1;
        this.collisionDeadzone = 20;
    }

    update(delta) {
        super.update();
        if (!this.hasLocation) {
            let index = this.prevLocation;
            while (index == this.prevLocation) {
                index = Math.floor(Math.random() * this.nodes.length);
            }
            this.prevLocation = index;
            this.hasLocation = true;
            this.movementAngle = Math.atan2(this.nodes[index][1] - this.y, this.nodes[index][0] - this.x);
            this.sin = Math.sin(this.movementAngle);
            this.cos = Math.cos(this.movementAngle);
            this.movementSleepTimer = 0;
            this.moving = false;
            this.radialAttack = (Math.floor(Math.random() * 2) == 0);
        }
        else {
            if (this.movementSleepTimer < this.movementSleepMax) {
                this.movementSleepTimer++;
            }
            else {
                if (this.x >= this.nodes[this.prevLocation][0] - this.epsilon
                    && this.x <= this.nodes[this.prevLocation][0] + this.epsilon
                    && this.y >= this.nodes[this.prevLocation][1] - this.epsilon
                    && this.y <= this.nodes[this.prevLocation][1] + this.epsilon) {
                    this.hasLocation = false;
                }
                else {
                    let deltaSpeed = this.speed * delta;
                    this.x += this.cos * deltaSpeed;
                    this.y += this.sin * deltaSpeed;
                }
                this.moving = true;
            }
        }
        this.collisionX = this.x + this.collisionDeadzone;
        this.collisionY = this.y + this.collisionDeadzone;
        this.collisionWidth = this.width - (this.collisionDeadzone * 2);
        this.collisionHeight = this.height - (this.collisionDeadzone * 2);
    }

    draw() {
        super.draw();
        let rectHeight = 20;
        let rectX = this.x;
        let rectY = this.y - rectHeight;

        if (this.health > 2000) {
            context.fillStyle = 'orange';
            context.fillRect(rectX, rectY, this.width, rectHeight);
            context.fillStyle = 'green';
            context.fillRect(rectX, rectY, (this.width / 1000) * (this.health - 2000), rectHeight);
        }
        else if (this.health > 1000) {
            context.fillStyle = 'red';
            context.fillRect(rectX, rectY, this.width, rectHeight);
            context.fillStyle = 'orange';
            context.fillRect(rectX, rectY, (this.width / 1000) * (this.health - 1000), rectHeight);
        }
        else {
            if (this.health != 0) {
                context.fillStyle = 'red';
                context.fillRect(rectX, rectY, (this.width / 1000) * this.health, rectHeight);
            }
        }
        context.strokeStyle = "black";
        context.beginPath();
        context.rect(rectX, rectY, this.width, rectHeight);
        context.stroke();
    }
    reduceHealth(amt) {
        this.prevHealth = this.health;
        this.health -= amt;
        if ((this.health < 2000 && this.prevHealth >= 2000) 
            || (this.health < 1000 && this.prevHealth >= 1000)) {
            this.phase++;
        }
    }
}

class Bomb extends GameObject {
    constructor(x, y, width, height, speed) {
        let image = bombImage;
        super(x, y, width, height, image, speed);
        let arr = [1, -1]
        this.xDir = arr[Math.floor(Math.random() * arr.length)];

    }

    update(delta) {
        super.update();
        this.y += this.speed * delta;
        if (this.y > _HEIGHT) {
            this.active = false;
        }
        if (difficulty == "hard") {
            this.x += 15 * delta * this.xDir;
        }
    }
}

class RadialBomb extends GameObject {
    constructor(x, y, width, height, speed, angle) {
        let image = bombImage;
        super(x, y, width, height, image, speed);
        this.sin = Math.sin(angle * (Math.PI / 180));
        this.cos = Math.cos(angle * (Math.PI / 180));
        this.aliveTime = 0;
        this.aliveMax = 500;
    }

    update(delta) {
        super.update();
        let deltaSpeed = this.speed * delta;
        this.x += this.cos * deltaSpeed;
        this.y += this.sin * deltaSpeed;
        if (this.aliveTime >= this.aliveMax) {
            this.active = false;
        }
        else {
            this.aliveTime++;
        }
    }
}

class Bullet extends GameObject {
    constructor(x, y, width, height, speed, tiny) {
        let image = bulletmage;
        if (tiny) {
            width /= 2;
            height /= 2;
        }
        super(x, y, width, height, image, speed);
        this.tiny = tiny;
        this.aliveTime = 0;
        this.aliveMax = tiny ? 40 : 240;
    }

    update(delta) {
        super.update();
        this.x += this.speed * delta;
        if (this.aliveTime >= this.aliveMax) {
            this.active = false;
        }
        else {
            this.aliveTime++;
        }
    }
}

class Throwable extends GameObject {
    constructor(x, y, width, height, speed, targetX, targetY, sleepTimer) {
        let image = bombImage;
        super(x, y, width, height, image, speed);
        this.targetX = targetX;
        this.targetY = targetY;
        this.movementAngle = Math.atan2(targetY - y, targetX - x);
        this.sin = Math.sin(this.movementAngle);
        this.cos = Math.cos(this.movementAngle);
        this.timeSlept = 0;
        this.sleepTimer = sleepTimer;
        this.visible = false;
    }

    update(delta) {
        super.update();
        if (this.timeSlept < this.sleepTimer) {
            this.timeSlept++;
        }
        else {
            if (!this.visible) {
                this.visible = true;
            }
            let deltaSpeed = this.speed * delta;
            this.x += this.cos * deltaSpeed;
            this.y += this.sin * deltaSpeed;
            if (this.y < this.targetY) {
                this.active = false;
            }
        }
    }
}

class Particles extends GameObject {
    constructor(x, y, type) {
        let image = particleTypes[type];
        let speed = Math.floor(Math.random() * 1000) + 750;
        speed *= -1;
        super(x, y, image.width, image.height, image, speed);
        this.gravity = 100;
    }

    update(delta) {
        super.update();
        this.y += this.speed * delta;
        this.speed += this.gravity;
        if (this.y > _HEIGHT) {
            this.active = false;
        }
    }
}

class Quote extends GameObject {
    constructor() {
        let image = quoteImages[Math.floor(Math.random() * quoteImages.length)];
        let x = 800;
        let y = 125;
        super(x, y, image.width / 2, image.height / 2, image, 0);
        this.lifetime = 200;
        this.aliveCount = 0;
    }

    update(delta) {
        super.update();
        this.aliveCount++;
        if (this.aliveCount > this.lifetime) {
            this.active = false;
        }
    }
}

class ParallaxEntities {
    constructor() {
        this.backgroundImage = backgroundImage;
        this.flippedBackgroundImage = backgroundImageFlipped;
        this.backgroundImageX = 0;
        this.backgroundSpeed = 25;
        this.terrainImage = groundParallaxImage;
        this.flippedTerrainImage = groundParallaxImageFlipped;
        this.terrainImageX = 0;
        this.terrainImageY = _HEIGHT - groundParallaxImage.height;
        this.terrainImageHeight = groundParallaxImage.height;
        this.terrainSpeed = 100;
        this.active = true;
    }

    update(delta) {
        this.backgroundImageX -= this.backgroundSpeed * delta;
        if (this.backgroundImageX <= -_WIDTH * 2) {
            this.backgroundImageX = 0;
        }

        this.terrainImageX -= this.terrainSpeed * delta;
        if (this.terrainImageX <= -_WIDTH * 2) {
            this.terrainImageX = 0;
        }
    }

    draw() {
        context.drawImage(this.backgroundImage, this.backgroundImageX, 0, _WIDTH, _HEIGHT);
        context.drawImage(this.flippedBackgroundImage, this.backgroundImageX + _WIDTH, 0, _WIDTH, _HEIGHT);
        context.drawImage(this.backgroundImage, this.backgroundImageX + _WIDTH * 2, 0, _WIDTH, _HEIGHT);

        context.drawImage(this.terrainImage, this.terrainImageX, this.terrainImageY, _WIDTH, this.terrainImageHeight);
        context.drawImage(this.flippedTerrainImage, this.terrainImageX + _WIDTH, this.terrainImageY, _WIDTH, this.terrainImageHeight);
        context.drawImage(this.terrainImage, this.terrainImageX + _WIDTH * 2, this.terrainImageY, _WIDTH, this.terrainImageHeight);
    }
}