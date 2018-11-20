#!/usr/bin/env node

require('@babel/polyfill'); // eslint-disable-line import/no-extraneous-dependencies
const filesByDirectory = require('.');

(async function main() {
  const iterator = filesByDirectory(['./fixture/level1']);
  // eslint-disable-next-line no-await-in-loop
  for (let item = await iterator.next(); !item.done; item = await iterator.next()) {
    process.stdout.write(`\n${item.value.join('\n')}\n`);
  }
})().catch(error => {
  process.stdout.write(`Error: ${error.message}\n`);
  process.exit(1);
});
