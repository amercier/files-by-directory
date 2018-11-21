#!/usr/bin/env node

require('@babel/polyfill'); // eslint-disable-line import/no-extraneous-dependencies
const filesByDirectory = require('.');

function invoke(iterator, fn) {
  return iterator
    .next()
    .then(({ done, value }) => done || Promise.resolve(fn(value)).then(() => invoke(iterator, fn)));
}

(function main() {
  return invoke(filesByDirectory(['./fixture/level1']), files => {
    process.stdout.write(`\n${files.join('\n')}\n`);
  });
})().catch(error => {
  process.stdout.write(`Error: ${error.message}\n`);
  process.exit(1);
});
