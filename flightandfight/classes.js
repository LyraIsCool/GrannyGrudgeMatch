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
    }

    draw() {
        if (this.visible) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
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
    }

    update(delta) {
        super.update();
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
        
        
        /* if (this.sick) {
            context.font = '25px Witch';
            context.fillStyle = 'white';
            context.fillText("Slowed!", 10, 30);
            context.fillStyle = 'green';
            context.fillRect(100, 7, 150, 28);
            context.fillStyle = 'red';
            context.fillRect(100, 7, (this.sickMax - this.sickCounter) / 2, 28);
        }*/ 
    }
}

class Granny extends AnimatedGameObject {
    constructor(x, y, width, height, image, numFrames, speed) {
        super(x, y, width, height, image, numFrames, speed);
    }

    update(delta) {
        super.update();
        /*if (left && this.x > 0) {
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
        }*/
    }

    draw() {
        super.draw();
        
        
        /* if (this.sick) {
            context.font = '25px Witch';
            context.fillStyle = 'white';
            context.fillText("Slowed!", 10, 30);
            context.fillStyle = 'green';
            context.fillRect(100, 7, 150, 28);
            context.fillStyle = 'red';
            context.fillRect(100, 7, (this.sickMax - this.sickCounter) / 2, 28);
        }*/ 
    }
}

class Bomb extends GameObject {
    constructor(x, y, width, height, speed) {
        let image = bombImage;
        super(x, y, width, height, image, speed);
    }

    update(delta) {
        this.y += this.speed * delta;
        if (this.y > _HEIGHT) {
            this.active = false;
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