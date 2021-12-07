const assert = require('assert/strict');
const fs = require('fs');

function readInput(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err, data) {
      resolve(data.split(',').map((n) => parseInt(n)));
    })
  })
}

//
const getMax = (numbers) => numbers.sort((a, b) => a + b)[0];
const getMin = (numbers) => numbers.sort((a, b) => a - b)[0];
const calcFuel = (numbers, target) => numbers.reduce((fuel, position) => fuel + Math.abs(position - target), 0);
const calcFuelIncrement = (numbers, target) => numbers.reduce((fuel, position) => fuel + moveWithIncrement(position, target), 0);

const moveWithIncrement = (position, target) => {
  const steps = Math.abs(position - target);
  return ((steps + 1) / 2) * steps;
}

function solve1(input) {
  const maxPosition = getMax(input);
  const fuelNeeded = [];
  for (let index = 0; index < maxPosition; index++) {
    fuelNeeded[index] = calcFuel(input, index);
  }

  return getMin(fuelNeeded);
}

function solve2(input) {
  const maxPosition = getMax(input);
  const fuelNeeded = [];
  for (let index = 0; index < maxPosition; index++) {
    fuelNeeded[index] = calcFuelIncrement(input, index);
  }

  return getMin(fuelNeeded);
}

async function start() {
  assert.equal(moveWithIncrement(0, 1), 1);
  assert.equal(moveWithIncrement(0, 2), 3);
  assert.equal(moveWithIncrement(0, 3), 6);

  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput), 37);
  assert.equal(solve2(testInput), 168);

  const input = await readInput('./input.txt');
  console.log(solve1(input));
  console.log(solve2(input));
}

start();