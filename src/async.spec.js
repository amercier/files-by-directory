import '@babel/polyfill'; // Required for NodeJS < 10
import { asyncFlattenMap, asyncMap, promisify, values } from './async';

const array = ['foo', 'bar', 'baz'];

function* synchronousGenerator() {
  for (const value of array) {
    yield value;
  }
}

async function* asynchronousGenerator() {
  yield array[0];
  yield new Promise(resolve => setTimeout(() => resolve(array[1]), 10));
  yield Promise.resolve(array[2]);
}

/** @test {promisify} */
describe('promisify', () => {
  function successfulAsyncFunction(cb) {
    setTimeout(() => cb(null, 'SUCCESS'), 0);
  }

  function failingAsyncFunction(cb) {
    setTimeout(() => cb('FAILURE'), 0);
  }

  const promisedSuccessfulAsyncFunction = promisify(successfulAsyncFunction);
  const promisedFailingAsyncFunction = promisify(failingAsyncFunction);

  it('is a function', () => {
    expect(promisify).toBeFunction();
  });

  it('returns a function', () => {
    expect(promisedSuccessfulAsyncFunction).toBeFunction();
  });

  it('returns a function that returns a Promise', () => {
    expect(promisedSuccessfulAsyncFunction()).toBeInstanceOf(Promise);
  });

  it('resolves the Promise when callback is called without error', async () => {
    await expect(promisedSuccessfulAsyncFunction()).toResolve();
  });

  it('resolves the Promise with the second argument', async () => {
    expect(await promisedSuccessfulAsyncFunction()).toBe('SUCCESS');
  });

  it('rejects the Promise when callback is called with an error', async () => {
    await expect(promisedFailingAsyncFunction()).toReject();
  });

  it('rejects the Promise with the error argument', async () => {
    try {
      await promisedFailingAsyncFunction();
    } catch (error) {
      expect(error).toBe('FAILURE');
    }
  });
});

/** @test {asyncMap} */
describe('asyncMap', () => {
  it('is a function', () => {
    expect(asyncMap).toBeFunction();
  });

  [
    ['an array', () => ['foo', 'bar', 'baz']],
    ['a synchronous iterator', synchronousGenerator],
    ['an asynchronous iterator', asynchronousGenerator],
  ].forEach(([whatIterable, getIterable]) => {
    describe(`when iterable is a ${whatIterable}`, () => {
      [
        ['a synchronous function', str => `qux${str}`],
        ['an asynchronous function', async str => Promise.resolve(`qux${str}`)],
      ].forEach(([whatFn, fn]) => {
        describe(`and fn is ${whatFn}`, () => {
          it('returns an asynchronous iterator', () => {
            const iterator = asyncMap(getIterable(), fn);
            expect(iterator.next).toBeFunction();
            expect(iterator.next()).toBeInstanceOf(Promise);
          });

          it('yields expected values asynchronously', async () => {
            for await (const item of asyncMap(getIterable(), fn)) {
              expect(item).toMatchSnapshot();
            }
          });
        });
      });
    });
  });
});

/** @test {asyncFlattenMap} */
describe('asyncFlattenMap', () => {
  it('is a function', () => {
    expect(asyncFlattenMap).toBeFunction();
  });

  function* synchronousItemGenerator(string) {
    yield `${string}1`;
    yield `${string}2`;
    yield `${string}3`;
  }

  async function* asynchronousItemGenerator(string) {
    yield `${string}1`;
    yield new Promise(resolve => setTimeout(() => resolve(`${string}2`), 10));
    yield Promise.resolve(`${string}3`);
  }

  [
    ['an array', () => array],
    ['a synchronous iterator', synchronousGenerator],
    ['an asynchronous iterator', asynchronousGenerator],
  ].forEach(([whatIterable, getIterable]) => {
    describe(`when iterable is a ${whatIterable}`, () => {
      [
        ['a synchronous generator', synchronousItemGenerator],
        ['an asynchronous generator', asynchronousItemGenerator],
      ].forEach(([whatFn, fn]) => {
        describe(`and fn is ${whatFn}`, () => {
          it('returns an asynchronous iterator', () => {
            const iterator = asyncFlattenMap(getIterable(), fn);
            expect(iterator.next).toBeFunction();
            expect(iterator.next()).toBeInstanceOf(Promise);
          });

          it('yields expected values asynchronously', async () => {
            for await (const item of asyncFlattenMap(getIterable(), fn)) {
              expect(item).toMatchSnapshot();
            }
          });
        });
      });
    });
  });
});

/** @test {values} */
describe('values', () => {
  it('is a function', () => {
    expect(values).toBeFunction();
  });

  [
    ['an array', () => array],
    ['a synchronous iterator', synchronousGenerator],
    ['an asynchronous iterator', asynchronousGenerator],
  ].forEach(([whatIterable, getIterable]) => {
    describe(`when iterable is a ${whatIterable}`, () => {
      it('returns a Promise', () => {
        expect(values(getIterable())).toBeInstanceOf(Promise);
      });

      it('resolves to an array containing all values', async () => {
        expect(await values(getIterable())).toEqual(array);
      });
    });
  });
});
