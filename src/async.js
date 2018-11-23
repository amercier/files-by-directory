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
 * @param {Iterable<T>} iterable Synchronous or asynchronous iterable.
 * @param {Function: T => U} fn Synchronous or asynchronous function.
 * @returns {AsyncIterator<U>} An asynchronous iterator that yields value returned by `fn` applied to
 * each element of `iterable`.
 */
export async function* asyncMap(iterable, fn) {
  for await (const value of iterable) {
    yield fn(value);
  }
}

/**
 * Return an asynchronous generator that yields all elements from a given iterable that pass the
 * test implemented by the provided function.
 *
 * @async
 * @generator
 * @param {Iterable<T>} iterable Synchronous or asynchronous iterable.
 * @param {Function: T => boolean} filter Synchronous or asynchronous function.
 * @returns {AsyncIterator<T>} An asynchronous iterator that yields values from `iterable` where
 * `filter` return a truthy value.
 */
export async function* asyncFilter(iterable, filter) {
  for await (const value of iterable) {
    if (await filter(value)) {
      yield value;
    }
  }
}

/**
 * Apply a given generator to each element of a given iterable, and re-yield every yielded values.
 *
 * @async
 * @generator
 * @param {Iterable<T>} iterable Synchronous or asynchronous iterable.
 * @param {Function: T => Iterable<U>} generator Synchronous or asynchronous generator function.
 * @returns {AsyncIterator<U>} An asynchronous iterator that re-yields each value yielded by `generator(iterable[i])`.
 */
export async function* asyncFlattenMap(iterable, generator) {
  for await (const value of iterable) {
    yield* generator(value);
  }
}

/**
 * Get all values from an iterable.
 *
 * @param {Iterable<T>} iterable Synchronous or asynchronous iterable.
 * @returns {Promise<T[]>} A Promise resolving to an array containing all yielded values.
 */
export async function values(iterable) {
  const array = [];
  for await (const value of iterable) {
    array.push(value);
  }
  return array;
}
