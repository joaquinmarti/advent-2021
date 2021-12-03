const assert = require('assert/strict');
const fs = require('fs');

function readInput() {
  return new Promise((resolve) => {
    fs.readFile(`./input.txt`, 'utf8', function (err, data) {
      resolve(data.split('\n'));
    })
  })
}

// Returns an array of tuples, every tuple describe a bit position. The tuple contains the number of appearances of the two bits.
// [[3, 5]] means for the first position (first tuple) bit 0 appears 3 times and bit 1 appears 5 times
const bitsCount = (input, start, length) => {
  return input.reduce((count, bits) => {
    [...bits.substring(start, length)].forEach((bit, index) => {
      count[index][parseInt(bit)] += 1;
    });

    return count;
  }, Array(length).fill(true).map(el => [0, 0]));
}

// Returns a function to use later on in the "filter" method
const filterBit = (bit, index) => el => el.substring(index, index + 1) === String(bit);

// Return the most and less common bits of a tuple. It considers too the default value when the two numbers are equal
const mostCommonBit = (bits) => +!(bits[0] > bits[1]);
const lessCommonBit = (bits) => +(bits[0] > bits[1]);

//

function solve1(input) {
  const count = bitsCount(input, 0, input[0].length);

  const [e, g] = count.reduce((power, bits) => ([
    power[0].concat(mostCommonBit(bits)),
    power[1].concat(lessCommonBit(bits)),
  ]), ['', '']);

  return parseInt(e, 2) * parseInt(g, 2);
}

function solve2(input) {
  const length = input[0].length;

  // Duplicate input array to filter it later independently for oxigen and co2
  let oxigen = [...input];
  let co2 = [...input];

  for (let index = 0; index < length; index++) {
    let oxigenNextBit = mostCommonBit(bitsCount(oxigen, index, index + 1)[0]);
    let co2NextBit = lessCommonBit(bitsCount(co2, index, index + 1)[0]);

    if (oxigen.length > 1) {
      oxigen = oxigen.filter(filterBit(oxigenNextBit, index));
    }

    if (co2.length > 1) {
      co2 = co2.filter(filterBit(co2NextBit, index));
    }
  }

  return parseInt(oxigen[0], 2) * parseInt(co2[0], 2);
}

async function start() {
  // Assert bit determination functions
  assert.equal(mostCommonBit([7, 5]), 0);
  assert.equal(mostCommonBit([5, 7]), 1);
  assert.equal(mostCommonBit([5, 5]), 1);

  assert.equal(lessCommonBit([7, 5]), 1);
  assert.equal(lessCommonBit([5, 7]), 0);
  assert.equal(lessCommonBit([5, 5]), 0);

  //
  const testInput = ['00100', '11110', '10110', '10111', '10101', '01111', '00111', '11100', '10000', '11001', '00010', '01010'];
  assert.equal(solve1(testInput), 198);
  assert.equal(solve2(testInput), 230);

  const input = await readInput();
  console.log(solve1(input));
  console.log(solve2(input));
}

start();