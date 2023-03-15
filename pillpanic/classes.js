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

class Player extends GameObject {
    constructor(x, y, width, height, image, speed, speedModifier) {
        super(x, y, width, height, image, speed);
        this.upperCollisionBound = 535;
        this.lowerCollisionBound = 580;
        this.sick = false;
        this.sickCounter = 0;
        this.sickMax = 300;
        this.speedModifier = speedModifier;
    }

    update(delta) {
        if (this.sick) {
            this.sickCounter++;
            if (this.sickCounter > this.sickMax) {
                this.sickCounter = 0;
                this.sick = false;
            }
        }
        let currSpeed = this.sick ? _PLAYER_SPEED * this.speedModifier : _PLAYER_SPEED;
        currSpeed *= delta;
        if (left && this.x > 0) {
            this.x -= currSpeed;
        }
        if (right && this.right() < _WIDTH) {
            this.x += currSpeed;
        }
    }

    draw() {
        super.draw();
        if (this.sick) {
            context.font = '25px Witch';
            context.fillStyle = 'white';
            context.fillText("Slowed!", 10, 30);
            context.fillStyle = 'green';
            context.fillRect(100, 7, 150, 28);
            context.fillStyle = 'red';
            context.fillRect(100, 7, (this.sickMax - this.sickCounter) / 2, 28);
        }
    }
}

class Catchable extends GameObject {
    constructor(x, y, width, height, type, speed) {
        let image = projectileTypes[type];
        super(x, y, width, height, image, speed);
        this.type = type;
    }

    update(delta) {
        this.y += this.speed * delta;
        if (this.y > _HEIGHT) {
            this.active = false;
            if (this.type == "s") {
                missed++;
            }
        }
    }
}

class Throwable extends GameObject {
    constructor(x, y, width, height, type, speed, targetX, targetY, sleepTimer) {
        let image = projectileTypes[type];
        super(x, y, width, height, image, speed);
        this.type = type;
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

class Fog extends GameObject {
    constructor() {
        let image = fogImg;
        super(0, 0, image.width, image.height, image, _FOG_SPEED);
    }

    update(delta) {
        this.x -= this.speed * delta;
        if (this.x <= -_WIDTH) {
            this.x = 0;
        }
    }

    draw() {
        super.draw();
        context.drawImage(this.image, this.x + _WIDTH, this.y, this.width, this.height);
    }
}