const _ = require('lodash');
const { performance } = require('perf_hooks');

// Số kết nối song song càng nhiều thì tốc độ càng nhanh nhưng độ hao tổn tài nguyên càng lớn

const batchOfPromiseAll = async (listOfArguments, limit, asyncOperation) => {
  const concurrencyLimit = Math.ceil(listOfArguments.length / limit);
  // Tạo index cho array
  const argsCopy = [].concat(listOfArguments.map((val, ind) => ({ val, ind })));

  const result = new Array(listOfArguments.length);

  const promises = new Array(concurrencyLimit).fill(Promise.resolve());

  // Đưa promise liên tiếp vào chuỗi thực thi
  function chainNext(p) {
    if (argsCopy.length) {
      const arg = argsCopy.shift();
      return p.then(() => {
        // Lưu kết quả vào array khi Promise chạy xong
        const operationPromise = asyncOperation(arg.val).then(r => {
          result[arg.ind] = r;
        });
        return chainNext(operationPromise);
      });
    }
    return p;
  }

  await Promise.all(promises.map(chainNext));
  return result;
};

async function runAllPromise(arguments, batchSize, asyncOperation) {
  const batches = _.chunk(arguments, batchSize);
  const results = [];
  while (batches.length) {
    const batch = batches.shift();
    // eslint-disable-next-line no-await-in-loop
    const result = await Promise.all(batch.map(asyncOperation));
    results.push(result);
  }
  return _.flatten(results);
}

const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr];
  if (chunkSize <= 0) return cache;
  while (tmp.length) cache.push(tmp.splice(0, chunkSize));
  return cache;
};

const flatten = arr => arr.reduce((a, b) => a.concat(b), []);

async function vanillaRunAllPromise(arguments, batchSize, asyncOperation) {
  const batches = chunk(arguments, batchSize);
  const results = [];
  while (batches.length) {
    const batch = batches.shift();
    // eslint-disable-next-line no-await-in-loop
    const result = await Promise.all(batch.map(asyncOperation));
    results.push(result);
  }
  return flatten(results);
}
// const timeOut = t => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(`Completed in ${t}`);
//     }, t);
//   });
// };

// const durations = Array.from(Array(10000).keys());

// const main = async () => {
//   const t0 = performance.now();

//   // const data = await batchOfPromiseAll(durations, 1, timeOut);
//   const data = await Promise.all(durations.map(timeOut));
//   // const data = await runAllPromise(durations, 2, timeOut);
//   // const data = await vanillaRunAllPromise(durations, 20, timeOut);

//   const t1 = performance.now();
//   console.log(`Call to run all promise took ${(t1 - t0) / 1000} seconds.`);
// };

// main();

module.exports = {
  batchOfPromiseAll,
};
