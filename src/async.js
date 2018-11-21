import regeneratorRuntime from 'regenerator-runtime';

/**
 * Naive Promisify implementation.
 *
 * Implementing this instead of using NodeJS `util.Promisify` allow to maintain NodeJS 6 support.
 * @see {@link https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original|util.promisify(original)}
 *
 * @param {Function} fn Function of the form: (err, callback).
 * @returns {Function} A function that returns a Promise instead.
 */
export function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) =>
      fn(...args, (err, result) => (err ? reject(err) : resolve(result))),
    );
}

/**
 * Apply a given function to each elements of a given iterable, and yield each returned value.
 *
 * @async
 * @generator
 * @param {Iterable} iterable Synchronous or asynchronous iterable.
 * @param {Function} fn Synchronous or asynchronous function.
 * @returns {Iterator} An asynchronous iterator that yields each value returned from `fn(iterable[i])`.
 */
export async function* asyncMap(iterable, fn) {
  for await (const value of iterable) {
    yield fn(value);
  }
}

/**
 * Apply a given generator to each element of a given iterable, and re-yield every yielded values.
 *
 * @async
 * @generator
 * @param {Iterable} iterable Synchronous or asynchronous iterable.
 * @param {Function} generator Synchronous or asynchronous generator function.
 * @returns {Promise} An asynchronous iterator that re-yields each value yielded by `generator(iterable[i])`.
 */
export async function* asyncFlattenMap(iterable, generator) {
  for await (const value of iterable) {
    yield* generator(value);
  }
}

/**
 * Get all values from an iterable.
 *
 * @param {Iterable} iterable Synchronous or asynchronous iterable.
 * @returns {Promise} A Promise resolving to an array containing all yielded values.
 */
export async function values(iterable) {
  const array = [];
  for await (const value of iterable) {
    array.push(value);
  }
  return array;
}
