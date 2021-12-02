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
    command: line.substr(0, line.indexOf(' ')),
    amount: parseInt(line.substr(line.indexOf(' ') + 1)),
  }))
}

//

function navigate(position, instruction) {
  switch (instruction.command) {
    case 'forward':
      return {
        x: position.x + instruction.amount,
        depth: position.depth,
      }
    case 'up':
      return {
        x: position.x,
        depth: position.depth - instruction.amount,
      }
    case 'down':
      return {
        x: position.x,
        depth: position.depth + instruction.amount,
      }
    default:
      return position;
  }
}

function navigateWithAim(position, instruction) {
  switch (instruction.command) {
    case 'forward':
      return {
        x: position.x + instruction.amount,
        depth: position.depth + position.aim * instruction.amount,
        aim: position.aim,
      };
    case 'up':
      return {
        x: position.x,
        depth: position.depth,
        aim: position.aim - instruction.amount,
      };
    case 'down':
      return {
        x: position.x,
        depth: position.depth,
        aim: position.aim + instruction.amount,
      };
    default:
      return position;
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