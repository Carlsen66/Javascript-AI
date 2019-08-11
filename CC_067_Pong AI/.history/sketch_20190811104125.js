// port of Daniel Shiffman's Pong coding challenge
// by madacoo
let bestGames = []
let activeGames = []
let allGames = []

let leftscore = 0;
let rightscore = 0;
let runBest = 0
let bestGame = 0

let HighScoreLeftSpan;
let allTimeHighScoreLeftSpan;
let HighScoreRightSpan;
let allTimeHighScoreRightSpan;
// All time high score
let HighScoreLeft = 0;
let HighScoreRight = 0;
let runManuel = 0

let NumOfGames = 200

function setup() {
    var cnv = createCanvas(600, 400);
    cnv.parent(canvascontainer)
    console.log('PingPong AI')
    // ding = loadSound("data/ding.mp3");
    // puck = new Puck();
    // left = new Paddle(true);
    // right = new Paddle(false);
    for (let i = 0; i < NumOfGames; i++) {

        let g = new TheGame()

        activeGames[i] = g
        allGames[i] = g
    }
    // activeGames[i] = new TheGame()
    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');
    HighScoreLeftSpan = select('#hsl');
    allTimeHighScoreLeftSpan = select('#ahsl');
    HighScoreRightSpan = select('#hsr');
    allTimeHighScoreRightSpan = select('#ahsr');
    runBestButton = select('#best');
    runBestButton.mousePressed(RunBestOnOff);
    SaveButton = select('#savebest');
    SaveButton.mousePressed(SaveBestGame);
    LoadButton = select('#loadbest');
    LoadButton.mousePressed(LoadBestGame);
    ManButton = select('#manuel');
    ManButton.mousePressed(ManuelGame);
}

function RunBestOnOff() {
    runBest = !runBest;
    if (runBest) {
        resetGame();
        runBestButton.html('continue training');
        // Go train some more
    } else {
        nextGeneration();
        runBestButton.html('run best');
    }
}

function ManuelGame() {
    runManuel = !runManuel;
    if (runManuel) {
        // resetGame();
        ManButton.html('AI Mode');
        // Go train some more
    } else {
        // nextGeneration();
        ManButton.html('Manuel');
    }
}

function draw() {
    let ng = 1
    background(0, 100, 0)
    stroke(255, 255)
    line(width / 2, 0, width / 2, height)

    //  Should we speed up cycles per frame
    let cycles = speedSlider.value()
    speedSpan.html(cycles)
    if (runBest) {
        activeGames[0] = bestGame
        ng = activeGames.length

    } else {
        ng = 1
    }

    for (n = 0; n < cycles; n++) {
        for (let i = activeGames.length - ng; i >= 0; i--) {
            // if (activeGames[i].dead == false) {

            if (activeGames[i].puck.checkPaddleRight(activeGames[i].right)) {
                activeGames[i].right.score += 1
            }
            if (activeGames[i].puck.checkPaddleLeft(activeGames[i].left)) {
                activeGames[i].left.score += 1
            }
            if (n == 0 && i == 0) {
                activeGames[i].left.show();
                activeGames[i].right.show();
            }
            activeGames[i].left.update();
            activeGames[i].right.update();
            activeGames[i].left.think(activeGames[i].puck)
            if (!runManuel) {
                activeGames[i].right.think(activeGames[i].puck)
            }
            activeGames[i].puck.update();
            if (n == 0 && i == 0) {
                activeGames[i].puck.show();
            }
            if (activeGames[i].puck.edges() == true) {
                activeGames.splice(i, 1)
                // activeGames[i].dead = true
                // console.log('Død')
            }

            if (activeGames.length == 0) {
                console.log('New Game')
                nextGeneration();
                leftscore = 0
                rightscore = 0
            }
            fill(255);
            textSize(32);
            text(leftscore, 32, 40);
            text(rightscore, width - 64, 40);
            // }
            // What is highest score of the current population
            let tempHighScoreLeft = 0;
            // If we're training
            if (!runBest) {
                // Which is the best Game?
                let tempBestGame = null;
                for (let i = 0; i < activeGames.length; i++) {
                    let s = activeGames[i].left.score;
                    if (s > tempHighScoreLeft) {
                        tempHighScoreLeft = s;
                        tempBestGame = activeGames[i];
                    }
                }

                // Is it the all time high scorer?
                if (tempHighScoreLeft > HighScoreLeft) {
                    HighScoreLeft = tempHighScoreLeft;
                    bestGame = tempBestGame;
                }
            } else {
                // Just one Game, the best one so far
                tempHighScoreLeft = bestGame.score;
                if (tempHighScoreLeft > HighScoreLeft) {
                    HighScoreLeft = tempHighScoreLeft;
                }
            }

            // Update DOM Elements
            HighScoreLeftSpan.html(tempHighScoreLeft);
            allTimeHighScoreLeftSpan.html(HighScoreLeft);

            let tempHighScoreRight = 0;
            // If we're training
            if (!runBest) {
                // Which is the best Game?
                let tempBestGame = null;
                for (let i = 0; i < activeGames.length; i++) {
                    let s = activeGames[i].right.score;
                    if (s > tempHighScoreRight) {
                        tempHighScoreRight = s;
                        tempBestGame = activeGames[i];
                    }
                }

                // Is it the all time high scorer?
                if (tempHighScoreRight > HighScoreRight) {
                    HighScoreRight = tempHighScoreRight;
                    bestGame = tempBestGame;
                }
            } else {
                // Just one Game, the best one so far
                tempHighScoreRight = bestGame.score;
                if (tempHighScoreRight > HighScoreRight) {
                    HighScoreRight = tempHighScoreRight;
                }
            }

            // Update DOM Elements
            HighScoreRightSpan.html(tempHighScoreRight);
            allTimeHighScoreRightSpan.html(HighScoreRight);

            if (activeGames.length == 0) {
                console.log('New Game')
                nextGeneration();
            }
        }
    }
}


function keyReleased() {
    bestGame.left.move(0);
    bestGame.right.move(0);
}

function keyPressed() {
    console.log(key);
    if (key == 'A') {
        bestGame.left.move(-10);
    } else if (key == 'Z') {
        bestGame.left.move(10);
    }

    if (key == 'J') {
        bestGame.right.move(-10);
    } else if (key == 'M') {
        a
        bestGame.right.move(10);
    }
}

function SaveBestGame() {
    let json = {};
    json = bestGame;

    saveJSON(json, 'GameBrain.json')
}

function getdata(json) {
    if (typeof json == 'string') {
        json = JSON.parse(json);
    }
    let GameBrain = new TheGame()
    GameBrain.left.brain = NeuralNetwork.deserialize(json.left.brain);
    GameBrain.right.brain = NeuralNetwork.deserialize(json.right.brain);
    bestGame = GameBrain;

    runBest = true;
    resetGames();
    leftscore = 0
    rightscore = 0
    runBestButton.html('continue training');
}

function LoadBestGame() {
    loadJSON('GameBrain.json', getdata);
}