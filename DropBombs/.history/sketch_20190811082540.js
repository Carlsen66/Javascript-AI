let activeGuns = []
let allGuns = []
let bestGun = []
let gunfire = []
let count = 0
let keyOn = 0
let runBest = 0
let highScoreSpan;
let allTimeHighScoreSpan;
// All time high score
let highScore = 0;
let runManuel = 0
let NumOfGuns = 500

let bm = 30

const BOMBSCORE = 150
const BOMBLOST = 300
const STARTSCORE = 100
const BOMBHITGUN = 200

// Mutation function to be passed into Gun.brain
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function setup() {
  var canvas = createCanvas(400, 600);
  canvas.parent(canvascontainer)
  console.log('Drop Bumb')
  for (let i = 0; i < NumOfGuns; i++) {

    let g = new Gun()

    activeGuns[i] = g
    allGuns[i] = g
  }
  // console.log(activeGuns)
  bestGun = activeGuns[0]
  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(RunBestOnOff);
  SaveButton = select('#save');
  SaveButton.mousePressed(SaveBestGun);
  LoadButton = select('#load');
  LoadButton.mousePressed(LoadBestGun);
  ManButton = select('#manuel');
  ManButton.mousePressed(ManuelGun);
}

function RunBestOnOff() {
  runBest = !runBest;
  if (runBest) {
    resetGame();
    speedSlider.value(1)
    runBestButton.html('continue training');
    // Go train some more
  } else {
    highScore = 0
    nextGeneration();
    runBestButton.html('run best');
  }
}

function ManuelGun() {
  runManuel = !runManuel;
  if (runManuel) {
    // resetGame();
    ManButton.html('AI Mode');
    // Go train some more
  } else {
    resetGame();
    speedSlider.value(1)
    ManButton.html('Manuel');
  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    activeGuns[0].move(-5)
  } else if (keyCode === RIGHT_ARROW) {
    activeGuns[0].move(5)
  }
  keyOn = true
}

function keyReleased() {
  keyOn = false
}

function draw() {
  let bumbehit = 0
  let g = 0
  background(0)

  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  activeGuns[0].show()
  for (let i = 0; i < activeGuns[0].bumbs.length; i++) {
    activeGuns[0].bumbs[i].show()
  }
  for (let j = 0; j < activeGuns[0].fire.length; j++) {
    activeGuns[0].fire[j].show()
  }

  for (n = 0; n < cycles; n++) {
    if (runBest || runManuel) {
      g = 0
      activeGuns[0] = bestGun;
    } else {
      g = activeGuns.length - 1
    }
    //*** Loop all Guns game */
    for (let i = g; i >= 0; i--) {

      //*** Create a new Gunfire
      if (count > 8) {
        let fire = new Gunfire(activeGuns[i])
        activeGuns[i].fire.push(fire)
      }
      //console.log(i)
      //**** Loop GunFire Hit */ 
      if (activeGuns[i] != undefined) {
        for (let j = 0; j < activeGuns[i].fire.length; j++) {
          // activeGuns[i].fire[j].show()
          activeGuns[i].fire[j].update()
          activeGuns[i].fire[j].hits(activeGuns[i])
          if (activeGuns[i].fire[j].y < 0) {
            activeGuns[i].fire.splice(i, 1)
          }
        }

        //*** Crate new bumbs */
        if (activeGuns[i].bumbs.length == 0) {

          for (let j = 0; j < 3; j++) {
            bm = random(20, 250)
            activeGuns[i].bumbs[j] = new Bomb(bm + j * 50, 0 - ((j * 30) + 5))
          }
          activeGuns[i].games += 1
          activeGuns[i].gamescore = STARTSCORE
          bm += 50
          if (bm > 250) bm = 30
        }
        //*** Loop Bumbs Hit */
        for (let j = 0; j < activeGuns[i].bumbs.length; j++) {
          // activeGuns[i].bumbs[j].show()
          bumbehit = activeGuns[i].bumbs[j].hits(activeGuns[i])
          if (bumbehit) {
            activeGuns[i].gamescore -= BOMBHITGUN
          }
          if (activeGuns[i].bumbs[j].update() > height) {
            console.log('Missed bomb')
            activeGuns[i].bumbs.splice(i, 1)
            activeGuns[i].gamescore -= BOMBLOST
          }
        }

        if (runManuel) {
          if (keyOn) activeGuns[0].move(0)
        } else {
          //*** Gun Brain */
          if (!bumbehit && activeGuns[i].gamescore > 0) {
            activeGuns[i].think()
          } else if (runBest) {
            resetGame();
          } else {
            activeGuns.splice(i, 1)
            // console.log('Guns ' + activeGuns.length)
          }
        }
        // console.log('Bumbscore ' + activeGuns[i].gamescore)

        // What is highest score of the current population
        let tempHighScore = 0;
        // If we're training
        if (!runBest) {
          // Which is the best Gun?
          let tempBestGun = null;
          for (let i = 0; i < activeGuns.length; i++) {
            let s = activeGuns[i].games;
            if (s > tempHighScore) {
              tempHighScore = s;
              tempBestGun = activeGuns[i];
            }
          }

          // Is it the all time high scorer?
          if (tempHighScore > highScore) {
            highScore = tempHighScore;
            bestGun = tempBestGun;
          }
        } else {
          // Just one Gun, the best one so far
          tempHighScore = bestGun.score;
          if (tempHighScore > highScore) {
            highScore = tempHighScore;
          }
        }

        // Update DOM Elements
        highScoreSpan.html(tempHighScore);
        allTimeHighScoreSpan.html(highScore);
        if (activeGuns.length == 0) {
          console.log('New Game')
          nextGeneration();
        }
      }
    }
    count++
    if (count > 9) count = 0

  }
  // noLoop()
}

function SaveBestGun() {
  let json = {};
  json = bestGun.brain;

  saveJSON(json, 'GunBrain.json')
}

function getdata(json) {
  resetGame();
  let GunBrain = NeuralNetwork.deserialize(json);
  bestGun.brain = GunBrain;

  runBest = true;

  runBestButton.html('continue training');
}

function LoadBestGun() {
  loadJSON('GunBrain.json', getdata);
}