class Bomb {
    constructor(posx, posy) {
        this.x = random(10, width - 10)
        this.y = posy
        this.speed = 5
        this.w = 20

    }
    update() {
        this.y += this.speed
        return this.y
    }
    show() {
        fill(155)
        strokeWeight(1)
        ellipse(this.x, this.y, this.w)
    }

    hits(gun) {
        if ((this.y >= gun.y)) {
            if ((this.x >= gun.x - 10) && (this.x < gun.x + 30)) {
                console.log('Bomb hit')
                return true
            }
        }
        return false
    }
}

class Gun {
    constructor(brain) {
        this.x = width / 2
        this.y = height - 30
        this.w = 20
        this.dir = 0
        this.fitness = 0
        this.score = 0
        this.gamescore = STARTSCORE
        this.bumbs = []
        this.fire = []
        this.games = 0

        // Is this a copy of another Gun or a new one?
        // The Neural Network is the Gun's "brain"
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);
        } else {
            this.brain = new NeuralNetwork(7, 6, 2);
            // this.learning_rate = 0.1;
        }
    }

    // Create a copy of this Gun
    copy() {
        return new Gun(this.brain);
    }

    move(dir) {
        if (!dir == 0) this.dir = dir
        this.x += this.dir
        if (this.x < 10) this.x = 10
        if (this.x > width - 30) this.x = width - 30
    }

    show() {
        fill(200)
        rect(this.x, this.y, this.w, this.w)
        stroke(200)
        strokeWeight(4)
        line(this.x + this.w / 2, this.y, this.x + this.w / 2, this.y - 4)
    }

    think() {
        // Now create the inputs to the neural network
        let inputs = [];
        for (let i = 0; i < 6; i++) inputs[i] = 0;

        for (let i = 0; i < this.bumbs.length; i++) {
            const element = this.bumbs[i];
            let j = i * 2
            inputs[j] = map(element.x, 0, width, 0, 1);
            // 
            inputs[j + 1] = map(element.y, 0, height, 0, 1);
            // 
        }
        inputs[6] = map(this.x, 0, width, 0, 1);
        // console.log(inputs)
        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        // 
        // if (action[0] > action[1] && action[0] > 0.8) this.move(-5)
        // if (action[0] < action[1] && action[1] > 0.8) this.move(5)
        if (action[0] < action[1])
            this.move(-10)
        else
            this.move(10)
        this.gamescore -= 1
    }
}

class Gunfire {
    constructor(gun) {
        this.x = gun.x + (gun.w / 2)
        this.y = gun.y
    }

    hits(gun) {
        for (let i = 0; i < gun.bumbs.length; i++) {
            if ((this.x >= gun.bumbs[i].x - (gun.bumbs[i].w / 2)) && (this.x < gun.bumbs[i].x + (gun.bumbs[i].w / 2))) {
                if ((this.y < gun.bumbs[i].y + 10) && (this.y > gun.bumbs[i].y - 10)) {
                    // console.log('gunbullet hit')
                    gun.score += 1
                    // gun.gamescore += BOMBSCORE
                    gun.gamescore += map(gun.bumbs[i].y, 0, height, BOMBSCORE, -20)
                    gun.score += map(gun.bumbs[i].y, 0, height, 100, 0)
                    // console.log('Bumbscore ' + gun.gamescore)
                    gun.bumbs.splice(i, 1)
                }
            }
        }
    }

    update() {
        this.y -= 10
    }

    show() {
        fill(255, 0, 0)
        strokeWeight(1)
        ellipse(this.x, this.y, 5, 5)
    }
}