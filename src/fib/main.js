const path = require("path");
const ms = require("ms");
const { StaticPool } = require("node-worker-threads-pool");

const filePath = path.join(__dirname, "./worker.js");

const pool = new StaticPool({
  size: 10,
  task: filePath
});

const maxExecutions = 5;

const inputs = [...Array(maxExecutions).keys()].map(i => i + 1);

const promises = inputs.map((i) => {
  const num = 40 + i;
  const start = Date.now();
  console.log(`requesting computation for Fibonacci(${num})`);
  return pool.exec(num).then((res) => {
    const deltaTime = Date.now() - start;
    const resultBag = { input: num, result: res, deltaTime };
    console.log(`Fibonacci(${num}) result:`, resultBag);
    return resultBag;
  });
});

Promise
  .all(promises)
  .then((results) => {
    pool.destroy();
    const displayData = results.map((res) => {
      res.deltaTime = ms(res.deltaTime, { long: true });
      return res;
    });
    console.table(displayData);
  });