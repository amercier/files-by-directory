#!/usr/bin/env node

const filesByDirectory = require('.');

(async function main() {
  for await (const files of filesByDirectory(['./fixture/level1'])) {
    process.stdout.write(`\n${files.join('\n')}\n`);
  }
})().catch(error => {
  process.stdout.write(`Error: ${error.message}\n`);
  process.exit(1);
});
