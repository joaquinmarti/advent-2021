const assert = require('assert/strict');
const fs = require('fs');

function readyInput() {
  return new Promise((resolve) => {
    fs.readFile(`./input.txt`, 'utf8', function (err, data) {
      resolve(data.split('\n'));
    })
  })
}

function parseInstructions(instructions) {
  return instructions.map(line => ({
    type: line.substr(0, line.indexOf(' ')),
    value: parseInt(line.substr(line.indexOf(' ') + 1)),
  }))
}

//

function navigate(state, action) {
  switch (action.type) {
    case 'forward':
      return {
        x: state.x + action.value,
        depth: state.depth,
      }
    case 'up':
      return {
        x: state.x,
        depth: state.depth - action.value,
      }
    case 'down':
      return {
        x: state.x,
        depth: state.depth + action.value,
      }
    default:
      return state;
  }
}

function navigateWithAim(state, action) {
  switch (action.type) {
    case 'forward':
      return {
        x: state.x + action.value,
        depth: state.depth + state.aim * action.value,
        aim: state.aim,
      };
    case 'up':
      return {
        x: state.x,
        depth: state.depth,
        aim: state.aim - action.value,
      };
    case 'down':
      return {
        x: state.x,
        depth: state.depth,
        aim: state.aim + action.value,
      };
    default:
      return state;
  }
}

function solve1(input) {
  const position = input.reduce(navigate, {
    x: 0,
    depth: 0,
  });

  return position.x * position.depth;
}

function solve2(input) {
  const position = input.reduce(navigateWithAim, {
    x: 0,
    depth: 0,
    aim: 0,
  });

  return position.x * position.depth;
}

async function start() {
  const testInstructions = parseInstructions(['forward 5', 'down 5', 'forward 8', 'up 3', 'down 8', 'forward 2']);
  assert.equal(solve1(testInstructions), 150);
  assert.equal(solve2(testInstructions), 900);

  const input = parseInstructions(await readyInput());
  console.log(solve1(input));
  console.log(solve2(input));
}

start();