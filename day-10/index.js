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
  return line.split('');
}

//

const pairs = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

const errorPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const incompletePoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

//

function solve1(input) {
  const errors = input.reduce((errorsCount, line) => {
    const nextExpected = [];

    for (let index = 0; index < line.length; index++) {
      const char = line[index];

      if (pairs[char]) {
        nextExpected.push(pairs[char]);
      } else {
        if (char === nextExpected[nextExpected.length - 1]) {
          nextExpected.pop();
        } else {
          errorsCount[char] += 1;
          break;
        }
      }
    }

    return errorsCount;
  }, {
    ')': 0,
    ']': 0,
    '}': 0,
    '>': 0,
  });

  return Object.entries(errors).reduce((total, type) => total + type[1] * errorPoints[type[0]], 0);
}

function solve2(input) {
  const charsToComplete = [];

  input.forEach((line) => {
    const nextExpected = [];
    let foundError = false;

    for (let index = 0; index < line.length; index++) {
      const char = line[index];

      if (pairs[char]) {
        nextExpected.push(pairs[char]);
      } else {
        if (char === nextExpected[nextExpected.length - 1]) {
          nextExpected.pop();
        } else {
          foundError = true;
          break;
        }
      }
    }

    if (!foundError) {
      charsToComplete.push(nextExpected);
    }
  });

  const scores = charsToComplete.map((line) => {
    return line.reverse().reduce((total, char) => {
      return total * 5 + incompletePoints[char];
    }, 0);
  });

  return scores.sort((a, b) => a - b)[parseInt(scores.length / 2)];
}

async function start() {
  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput), 26397);
  assert.equal(solve2(testInput), 288957);

  const input = await readInput('./input.txt');
  console.log(solve1(input));
  console.log(solve2(input));
}

start();