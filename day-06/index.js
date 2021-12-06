const assert = require('assert/strict');
const fs = require('fs');

function readInput(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err, data) {
      resolve(data.split(',').map((n) => parseInt(n)));
    })
  })
}

// Convert the array of all the fishes into a way simpler array counting the fishes with the same internal number
const prepareFishesCounter = (fishes) => {
  return fishes.reduce((state, fish) => {
    state[fish] = state[fish] ? state[fish] += 1 : 1;
    return state;
  }, []);
}

//
const countFishesAfterIterations = (input, iterations) => {
  let fishes = [...input];

  for (let index = 0; index < iterations; index++) {
    let tempFishes = []; // Temporary array, so we don't mess with the original one while moving the indexes
    let fishesToSpawn = fishes[0];

    // Move the fishes 1 index smaller
    fishes.forEach((numberOfFishes, internal) => {
      if (internal > 0 && numberOfFishes) {
        tempFishes[internal - 1] = numberOfFishes;
      }
    });

    // Fishes to span will increment the fishes with number internal 6
    // and will create new ones with internal number of 8
    if (fishesToSpawn) {
      tempFishes[6] = tempFishes[6] ? tempFishes[6] += fishesToSpawn : fishesToSpawn;
      tempFishes[8] = fishesToSpawn;
    }

    // Assign the temporary one to the original array, so it will be used in the next iteration
    fishes = tempFishes;
  }

  return fishes.reduce((a, b) => a + b, 0);
};

function solve1(input, iterations) {
  return countFishesAfterIterations(input, iterations);
}

function solve2(input, iterations) {
  return countFishesAfterIterations(input, iterations);
}

async function start() {
  const testInput = prepareFishesCounter(await readInput('./test-input.txt'));
  assert.equal(solve1(testInput, 80), 5934);
  assert.equal(solve2(testInput, 256), 26984457539);

  const input = prepareFishesCounter(await readInput('./input.txt'));
  console.log(solve1(input, 80));
  console.log(solve2(input, 256));
}

start();