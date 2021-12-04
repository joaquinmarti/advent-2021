const assert = require('assert/strict');
const fs = require('fs');

function readInput(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err, data) {
      const lines = data.split('\n\n');
      resolve({
        numbers: lines[0].split(',').map(e => parseInt(e)),
        boards: lines.slice(1).map(l => l.replace(/\n/g, ' ').replace(/  /g, ' ').trim().split(' ').map(n => parseInt(n))),
      });
    })
  })
}

// Returns a tuple with calculated row and col depending on an index number
const findRowAndCol = (position, boardSize) => ([
  parseInt(position / boardSize),
  position % boardSize
]);

// Creates empty arrays to count the matches of rows and cols
const prepareCounters = (numberOfBoards, boardSize) => {
  return Array(numberOfBoards).fill(true).map(e => ([
    Array(boardSize).fill(0),
    Array(boardSize).fill(0),
  ]));
};

// Function with a side effect, but seemed too overkill to create a new copy of the counters
// for every number and every board
const checkBingo = (counters, boardIndex, row, col, boardSize, number) => {
  const isRowWinner = counters[boardIndex][0][row] === boardSize - 1;
  const isColWinner = counters[boardIndex][1][col] === boardSize - 1;

  // If the col or the row we are going to increment is the winner, return it
  if (isRowWinner || isColWinner) {
    return {
      boardIndex,
      number,
    }
  }

  // Otherwise, increment the counters
  counters[boardIndex][0][row] += 1;
  counters[boardIndex][1][col] += 1;

  return false;
}

const sumBoardNumbers = (board, numbers) => board.filter((n) => !~numbers.indexOf(n)).reduce((curr, acc) => curr + acc, 0);

//

function solve1(input, boardSize) {
  const { numbers, boards } = input;
  const counters = prepareCounters(boards.length, boardSize);
  let winner;

  numbers.every(number => {
    return boards.every((board, boardIndex) => {
      const index = board.indexOf(number);

      if (~index) {
        const [row, col] = findRowAndCol(index, boardSize);
        winner = checkBingo(counters, boardIndex, row, col, boardSize, number);

        return !winner;
      }

      return true;
    });
  });

  const sum = sumBoardNumbers(boards[winner.boardIndex], numbers.slice(0, numbers.indexOf(winner.number) + 1));
  return sum * winner.number;
}

function solve2(input, boardSize) {
  const { numbers, boards } = input;
  const counters = prepareCounters(boards.length, boardSize);
  let winners = [];
  let lastWinner;

  numbers.every(number => {
    return boards.every((board, boardIndex) => {
      const index = board.indexOf(number);

      if (~index) {
        const [row, col] = findRowAndCol(index, boardSize)
        const winner = checkBingo(counters, boardIndex, row, col, boardSize, number);

        if (winner && !~winners.indexOf(winner.boardIndex)) {
          winners.push(winner.boardIndex)
          lastWinner = winner;
        }

        return true;
      }

      return true;
    });
  });

  const sum = sumBoardNumbers(boards[lastWinner.boardIndex], numbers.slice(0, numbers.indexOf(lastWinner.number) + 1));
  return sum * lastWinner.number;
}

async function start() {
  const boardSize = 5;
  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput, boardSize), 4512);
  assert.equal(solve2(testInput, boardSize), 1924);

  const input = await readInput('./input.txt');
  console.log(solve1(input, boardSize));
  console.log(solve2(input, boardSize));
}

start();