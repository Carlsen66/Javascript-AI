class Puck {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.xspeed = 0;
        this.yspeed = 0;
        this.speed = Pspeed;
        this.r = 12;

        this.reset();
    }

    checkPaddleLeft(p) {
        if (this.y - this.r < p.y + p.h / 2 &&
            this.y + this.r > p.y - p.h / 2 &&
            this.x - this.r < p.x + p.w / 2) {

            if (this.x > p.x) {
                let diff = this.y - (p.y - p.h / 2);
                let rad = radians(45);
                let angle = map(diff, 0, p.h, -rad, rad)
                this.xspeed = this.speed * cos(angle) + random(-0.1, 0.1);
                this.yspeed = this.speed * sin(angle) + random(-0.1, 0.1);
                this.x = p.x + p.w / 2 + this.r;
                return true
            }
        }
        return false
    }
    checkPaddleRight(p) {
        if (this.y - this.r < p.y + p.h / 2 &&
            this.y + this.r > p.y - p.h / 2 &&
            this.x + this.r > p.x - p.w / 2) {

            if (this.x < p.x) {
                let diff = this.y - (p.y - p.h / 2);
                let angle = map(diff, 0, p.h, radians(225), radians(135))
                this.xspeed = this.speed * cos(angle) + random(-0.1, 0.1);
                this.yspeed = this.speed * sin(angle) + random(-0.1, 0.1);
                this.x = p.x - p.w / 2 - this.r;
                return true
            }
        }
        return false
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        let angle = random(-PI / 4, PI / 4);
        this.xspeed = this.speed * Math.cos(angle);
        this.yspeed = this.speed * Math.sin(angle);

        if (random(1) < 0.5) {
            this.xspeed *= -1;
        }
    }

    edges() {
        let ok = false
        if (this.y + this.r < 0 || this.y - this.r > height) {
            this.yspeed *= -1;
            ok = true
        }

        if (this.x - this.r > width) {
            // ding.play();
            leftscore++;
            // this.reset();
            return true
        }
        if (this.x + this.r < 0) {
            // ding.play();
            rightscore++;
            // this.reset();
            return true
        }
        if (ok) return false
    }

    show() {
        fill(255);
        ellipse(this.x, this.y, this.r * 2);
    }
}