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
  return line.split('').map(n => parseInt(n));
}

//
const isSmaller = (grid, point, value) => grid[point.indexRow] === undefined || grid[point.indexRow][point.indexCol] === undefined || value < grid[point.indexRow][point.indexCol];
const isUndefinedOr9 = (grid, point) => grid[point.indexRow] === undefined || grid[point.indexRow][point.indexCol] === undefined || grid[point.indexRow][point.indexCol] === 9;
const pointToString = (point) => `${point.indexRow}-${point.indexCol}`;

//
const getLeftPointIndex = (point) => ({ indexRow: point.indexRow, indexCol: point.indexCol - 1});
const getRightPointIndex = (point) => ({ indexRow: point.indexRow, indexCol: point.indexCol + 1});
const getUpPointIndex = (point) => ({ indexRow: point.indexRow - 1, indexCol: point.indexCol });
const getDownPointIndex = (point) => ({ indexRow: point.indexRow + 1, indexCol: point.indexCol });

//
const findAdjacentPoints = (grid, point, basinPoints) => {
  const adjacentPoints = [
    point.indexCol > 0 ? getLeftPointIndex(point) : undefined, // left
    point.indexCol < grid[0].length - 1 ? getRightPointIndex(point) : undefined, // right
    point.indexRow > 0 ? getUpPointIndex(point) : undefined, // up
    point.indexRow < grid.length - 1 ? getDownPointIndex(point) : undefined, // down
  ];

  adjacentPoints.forEach((point) => {
    if (point && !basinPoints.has(pointToString(point)) && !isUndefinedOr9(grid, point)) {
      basinPoints.set(pointToString(point), true);
      findAdjacentPoints(grid, point, basinPoints);
    }
  });
}

//

const getLowPoints = (grid) => {
  const lowPoints = [];

  grid.forEach((row, indexRow) => {
    row.forEach((height, indexCol) => {
      if (
        isSmaller(grid, getLeftPointIndex({indexRow, indexCol}), height) &&
        isSmaller(grid, getRightPointIndex({indexRow, indexCol}), height) &&
        isSmaller(grid, getUpPointIndex({indexRow, indexCol}), height) &&
        isSmaller(grid, getDownPointIndex({indexRow, indexCol}), height)
      ) {
        lowPoints.push({ height, indexRow, indexCol });
      }
    });
  });

  return lowPoints;
};

const getBasinlength = (grid) => (lowPoint) => {
  const basinPoints = new Map();
  basinPoints.set(pointToString(lowPoint), true);
  findAdjacentPoints(grid, lowPoint, basinPoints);
  return basinPoints.size;
};

//

function solve1(input) {
  const lowPoints = getLowPoints(input);
  return lowPoints.reduce((a, b) => a + b.height + 1, 0);
}

function solve2(input) {
  const basinsLengths = getLowPoints(input).map(getBasinlength(input));
  return basinsLengths.sort((a, b) => a - b).reverse().slice(0, 3).reduce((total, basin) => total * basin, 1);
}

async function start() {
  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput), 15);
  assert.equal(solve2(testInput), 1134);

  const input = await readInput('./input.txt');
  console.log(solve1(input));
  console.log(solve2(input));
}

start();