const assert = require('assert/strict');
const fs = require('fs');

function readInput() {
  return new Promise((resolve) => {
    fs.readFile(`./input.txt`, 'utf8', function (err, data) {
      resolve(data.split('\n'));
    })
  })
}

function parseActions(actions) {
  return actions.map(line => ({
    type: line.substr(0, line.indexOf(' ')),
    value: parseInt(line.substr(line.indexOf(' ') + 1)),
  }))
}

//

function navigate(state, action) {
  switch (action.type) {
    case 'forward':
      return {
        ...state,
        x: state.x + action.value,
      }
    case 'up':
      return {
        ...state,
        depth: state.depth - action.value,
      }
    case 'down':
      return {
        ...state,
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
        ...state,
        x: state.x + action.value,
        depth: state.depth + state.aim * action.value,
      };
    case 'up':
      return {
        ...state,
        aim: state.aim - action.value,
      };
    case 'down':
      return {
        ...state,
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
  const testActions = parseActions(['forward 5', 'down 5', 'forward 8', 'up 3', 'down 8', 'forward 2']);
  assert.equal(solve1(testActions), 150);
  assert.equal(solve2(testActions), 900);

  const input = parseActions(await readInput());
  console.log(solve1(input));
  console.log(solve2(input));
}

start();