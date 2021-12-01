const fs = require('fs');

function readyInput() {
  return new Promise((resolve) => {
    fs.readFile(`./input.txt`, 'utf8', function (err, data) {
      resolve(data.split('\n').map((n) => parseInt(n)));
    })
  })
}

//

function calcA(input) {
  return input.reduce((counter, depth, index, depths) => {
    const prevDepth = depths[index - 1];
    const isDeeper = prevDepth && prevDepth < depth;

    return isDeeper ? counter + 1 : counter;
  }, 0);
}

function calcB(input) {
  let prevValueHolder; // Holds the previous value in every loop iteration, so we don't need to calculate it

  return input.reduce((counter, depth, index, depths) => {
    const currentValue = depth + depths[index + 1] + depths[index + 2];
    const isDeeper = prevValueHolder && currentValue && prevValueHolder < currentValue;
    prevValueHolder = currentValue;
    return isDeeper ? counter + 1 : counter;
  }, 0);
}

async function start() {
  const input = await readyInput();
  console.log(calcA(input));
  console.log(calcB(input));
}

start();