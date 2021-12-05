const assert = require('assert/strict');
const fs = require('fs');

function readInput(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err, data) {
      resolve(data.split('\n').map((l) => l.split(' -> ').map(c => c.split(',').map(n => parseInt(n)))));
    })
  })
}

//
const getDirection = (x, y) => {
  if (x < y) return 1;
  if (x > y) return -1;
  return 0;
}

// Returns a tuple with the number of units to sum to x and y in the loop in order to get from
// x1,y1 to x2,y2. It assumes lines are horizontal, diagonal or 45 degrees diagonal
const getLineDirections = (line) => ([
  getDirection(line[0][0], line[1][0]),
  getDirection(line[0][1], line[1][1])
]);

// Returns all the points of a line as a tuple
const drawLine = (line) => {
  const [xDireciton, yDirection] = getLineDirections(line);
  let [[x, y], [lastX, lastY]] = line;
  const points = [];

  // Push initial point
  points.push([x, y]);

  // Push the points from x1,y1 to x2, y2
  // It assumes once x or y are equal to their last values the line is completely drawn
  // This works just because lines can be horizontal, vertical or 45 degrees diagonal
  while (x !== lastX || y !== lastY) {
    x += xDireciton;
    y += yDirection;
    points.push([x, y]);
  }

  return points;
}

const countOverlappingPoints = (points) => {
  const counter = new Map();

  points.flat().forEach(point => {
    const key = point.toString();
    if (counter.has(key)) {
      counter.set(key, counter.get(key) + 1);
    } else {
      counter.set(key, 1);
    }
  });

  return Array.from(counter.entries()).reduce((acc, p) => acc + (p[1] > 1 ? 1 : 0), 0);
};

function solve1(input) {
  const horizontalLines = input.filter(line => line[0][0] === line[1][0] || line[0][1] === line[1][1]);
  const pointsPerLine = horizontalLines.map(drawLine);
  return countOverlappingPoints(pointsPerLine);
}

function solve2(input) {
  const pointsPerLine = input.map(drawLine);
  return countOverlappingPoints(pointsPerLine);
}

async function start() {
  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput), 5);
  assert.equal(solve2(testInput), 12);

  const input = await readInput('./input.txt');
  console.log(solve1(input));
  console.log(solve2(input));
}

start();