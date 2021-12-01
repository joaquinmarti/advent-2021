const assert = require('assert/strict');
const fs = require('fs');

function readyInput() {
  return new Promise((resolve) => {
    fs.readFile(`./input.txt`, 'utf8', function (err, data) {
      resolve(data.split('\n').map((n) => parseInt(n)));
    })
  })
}

//

function solve1(input) {
}

function solve2(input) {
}

async function start() {
  assert.equal(solve1([]), undefined);
  assert.equal(solve2([]), undefined);

  const input = await readyInput();
  console.log(solve1(input));
  console.log(solve2(input));
}

start();