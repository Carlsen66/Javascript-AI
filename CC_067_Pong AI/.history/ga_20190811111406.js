// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy Games implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&


// This file includes functions for creating a new generation
// of Games.

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

// Start the Games over
function resetGames() {
  counter = 0;
  // Resetting best Games score to 0
  if (bestGames) {
    bestGames.score = 0;
  }
}

// Create the next generation
function nextGeneration() {
  GaameCounter = ++;
  resetGames();
  // Normalize the fitness values 0-1
  normalizeFitness(allGames);

  // Generate a new set of Games
  activeGames = generate(allGames);
  // Copy those Games to another array
  allGames = activeGames.slice();
}

// Generate a new population of Games
function generate(oldGames) {
  let newGames = [];

  for (let i = 0; i < oldGames.length; i++) {
    // Select a Games based on fitness 
    newGames[i] = new TheGame();
    let GamesRight = poolSelectionRight(oldGames);
    let GamesLeft = poolSelectionLeft(oldGames);
    newGames[i].right = GamesRight;
    newGames[i].left = GamesLeft;
  }
  return newGames;
}

// Normalize the fitness of all Games
function normalizeFitness(Games) {
  // Make score exponentially better?
  for (let i = 0; i < Games.length; i++) {
    Games[i].left.score = pow(Games[i].left.score, 2);
    Games[i].right.score = pow(Games[i].right.score, 2);
  }

  // Add up all the scores
  let sumleft = 0
  let sumright = 0;
  for (let i = 0; i < Games.length; i++) {
    sumleft += Games[i].left.score;
    sumright += Games[i].right.score;
  }
  // Divide by the sum
  for (let i = 0; i < Games.length; i++) {
    Games[i].left.fitness = Games[i].left.score / sumleft;
    Games[i].right.fitness = Games[i].right.score / sumright;
  }
}


// An algorithm for picking one Games from an array
// based on fitness
function poolSelectionLeft(Games) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= Games[index].left.fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return Games[index].left.copy(true);
}

// An algorithm for picking one Games from an array
// based on fitness
function poolSelectionRight(Games) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= Games[index].right.fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return Games[index].right.copy(false);
}