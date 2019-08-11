class TheGame {
    constructor(brain) {
        this.puck = new Puck();
        this.left = new Paddle(true, brain);
        this.right = new Paddle(false, brain);
    }
}

class Paddle {
    constructor(isLeft, brain) {
        this.y = height / 2;
        this.w = 20;
        this.h = 100;
        this.ychange = 0;
        this.score = 0
        this.fitness = 0
        this.isLeft = isLeft
        if (isLeft) {
            this.x = this.w;
        } else {
            this.x = width - this.w;
        }
        // Is this a copy of another Bird or a new one?
        // The Neural Network is the bird's "brain"
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);
        } else {
            this.brain = new NeuralNetwork(3, 4, 1);
            // this.learning_rate = 0.1;
        }
    }
    think(puck) {
        // Now create the inputs to the neural network
        let inputs = [];

        inputs[0] = map(puck.x, 0, width, 0, 1);
        inputs[1] = map(puck.y, 0, height, 0, 1);

        // inputs[2] = map(puck.x, 0, width, 1, 0);
        // inputs[3] = map(puck.y, 0, height, 1, 0);
        // // 

        // inputs[4] = map(this.x, 0, width, 0, 1);
        inputs[2] = map(this.y, 0, height, 0, 1);
        // console.log(inputs)
        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        // 
        if (action[0] > 0.6) {
            this.move(-7)
        } else if (action[0] < 0.4) {
            this.move(7)
        } else this.move(0)

    }

    // // Create a copy of this Gun
    copy(isLeft) {
        return new Paddle(isLeft, this.brain);
    }

    update() {
        // this.ychange += this.ychange / 10

        this.y += this.ychange;

        this.y = constrain(this.y, this.h / 2, height - this.h / 2);
        // this.score += abs(ly - this.y)
    }

    move(steps) {
        this.ychange = steps;
    }

    show() {
        fill(255);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }
}