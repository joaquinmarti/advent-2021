const assert = require('assert/strict');
const fs = require('fs');

function readInput() {
  return new Promise((resolve) => {
    fs.readFile(`./input.txt`, 'utf8', function (err, data) {
      resolve(data.split('\n').map((n) => parseInt(n)));
    })
  })
}

//

function solve1(input) {
  return input.reduce((counter, depth, index, depths) => {
    const prevDepth = depths[index - 1];
    const isDeeper = prevDepth && prevDepth < depth;
    return isDeeper ? counter + 1 : counter;
  }, 0);
}

function solve2(input) {
  return input.reduce((counter, depth, index, depths) => {
    const prevDepth = depths[index - 1];
    const nextOfTheNextDepth = depths[index + 2];
    const isDeeper = prevDepth && nextOfTheNextDepth && prevDepth < nextOfTheNextDepth;
    return isDeeper ? counter + 1 : counter;
  }, 0);
}

async function start() {
  assert.equal(solve1([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]), 7);
  assert.equal(solve2([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]), 5);

  const input = await readInput();
  console.log(solve1(input));
  console.log(solve2(input));
}

start();