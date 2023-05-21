import d from 'debug';
const debug = d('lib:timeouter');

// A function that executes an asynchronous function with a timeout
export async function executeWithTimeout(asyncFunc, arg, timeout, msg) {
  // Create a promise that rejects after the timeout
  let timer = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout expired in ${msg}`));
    }, timeout);
  });
  // Return the result of the race between the async function and the timer
  return await Promise.race([asyncFunc(arg), timer]);
}
