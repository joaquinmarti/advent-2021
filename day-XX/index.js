const assert = require('assert/strict');
const fs = require('fs');

function readInput(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err, data) {
      resolve(data.split('\n').map(parse));
    })
  })
}

function parse(line) {
  return parseInt(line);
}

//

function solve1(input) {
}

function solve2(input) {
}

async function start() {
  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput), undefined);
  assert.equal(solve2(testInput), undefined);

  const input = await readInput('./input.txt');
  console.log(solve1(input));
  console.log(solve2(input));
}

start();