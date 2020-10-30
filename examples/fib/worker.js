// Access the workerData by requiring it.
const { parentPort, threadId } = require("worker_threads");

// Something you shouldn"t run in main thread
// since it will block.
function fib(n) {
  if (n < 2) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

// Main thread will pass the data you need
// through this event listener.
parentPort.on("message", (param) => {
  if (typeof param !== "number") {
    throw new Error("param must be a number.");
  }

  console.log(`thread ${threadId} computing fib for ${param}`);

  const result = fib(param);

  // return the result to main thread.
  parentPort.postMessage(result);
});