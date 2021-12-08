const assert = require('assert/strict');
const fs = require('fs');

function readInput(file) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err, data) {
      resolve(data.split('\n').map((n) => n.split(' | ').map((d) => d.split(' '))));
    })
  })
}

//
const n = [
  'abcefg', // 0
  'cf', // 1
  'acdeg', // 2
  'acdfg', // 3
  'bcdf', // 4
  'abdfg', // 5
  'abdefg', // 6
  'acf', // 7
  'abcdefg', // 8
  'abcdfg', // 9
];

const findByLength = (pattern, d) => pattern.filter((s) => s.length === n[d].length);
const findByInclude = (pattern, number, exclude) => {
  return pattern.filter((d) => {
    if (d === exclude) return false;
    const segments = d.split('');
    return number.split('').every((s) => segments.includes(s));
  })[0];
};
const findByOverlap = (pattern, number, exclude) => {
  const digits = number.split('');
  return pattern.filter((d) => {
    if (d === exclude) return false;
    const segments = d.split('');
    return segments.every((s) => digits.includes(s));
  })[0];
};

const sortString = (string) => string.split('').sort().join('');

const findMapping = (pattern) => {
  const map = [];

  map[1] = findByLength(pattern, 1)[0];
  map[4] = findByLength(pattern, 4)[0];
  map[7] = findByLength(pattern, 7)[0];
  map[8] = findByLength(pattern, 8)[0];

  // Get numbers 0, 6 and 9. They all have same length
  const d069 = findByLength(pattern, 0);

  // Get numbers 2, 3 and 5
  const d235 = findByLength(pattern, 3);

  // Number 9 has same segments as 4
  map[9] = findByInclude(d069, map[4]);

  // Number 0 has same segments as 7, excluding 9
  map[0] = findByInclude(d069, map[7], map[9]);

  // Number 6 is the remaining number from d069
  map[6] = d069.filter((d) => d !== map[0] && d !== map[9])[0];

  // Number 3 has same segments as 7
  map[3] = findByInclude(d235, map[7]);

  // Number 5 overlaps completely number 9, exlcluding 3
  map[5] = findByOverlap(d235, map[9], map[3]);

  // Number 2 is the last one
  map[2] = d235.filter((d) => d !== map[3] && d !== map[5])[0];

  return map.map(sortString);
}

//

function solve1(input) {
  return input.reduce((count, line) => {
    return count + line[1].filter((digit) => {
      const { length } = digit;
      return length === n[1].length || length === n[4].length || length === n[7].length || length === n[8].length;
    }).length;
  }, 0);
}

function solve2(input) {
  return input.reduce((count, sequence) => {
    const mapping = findMapping(sequence[0]);

    const numbers = sequence[1].map((digit) => {
      const normalized = sortString(digit);
      return mapping.indexOf(normalized);
    }).join('');

    return count + parseInt(numbers);
  }, 0);
}

async function start() {
  const testInput = await readInput('./test-input.txt');
  assert.equal(solve1(testInput), 26);
  assert.equal(solve2(testInput), 61229);

  const input = await readInput('./input.txt');
  console.log(solve1(input));
  console.log(solve2(input));
}

start();