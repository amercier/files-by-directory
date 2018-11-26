# files-by-directory

> List files by directory, recursively, using [asynchronous iteration].
>
> This can be particularly useful for directory structures with lots of files, or slow files
> systems, since you can start treating the results straight away, without having to wait for the
> entire structure to be scanned.

[![Latest Stable Version](https://img.shields.io/npm/v/files-by-directory.svg)](https://www.npmjs.com/package/files-by-directory)
[![Build Status](https://img.shields.io/travis/amercier/files-by-directory/master.svg)](https://travis-ci.org/amercier/files-by-directory)
[![NPM Downloads](https://img.shields.io/npm/dm/files-by-directory.svg)](https://www.npmjs.com/package/files-by-directory)

[![dependencies Status](https://david-dm.org/amercier/files-by-directory/status.svg)](https://david-dm.org/amercier/files-by-directory)
[![Test Coverage](https://img.shields.io/codecov/c/github/amercier/files-by-directory/master.svg)](https://codecov.io/github/amercier/files-by-directory?branch=master)
[![API Documentation](https://doc.esdoc.org/github.com/amercier/files-by-directory/badge.svg)](https://doc.esdoc.org/github.com/amercier/files-by-directory/)

## Installation

Prerequisites: [Node.js](https://nodejs.org/) 6+, **npm** 3+.

```bash
npm install --save files-by-directory
```

## API

### `filesByDirectory(paths: string[], options = {}): AsyncIterator<string[]>`

Scan directories recursively, and generate 1 array per directory, containing the file paths.

```bash
# Directory structure:
level1
├── level2a
│   ├── level3
│   │   ├── file3a
│   │   └── file3b
│   └── file2a
├── level2b
│   └── file2b
├── file1a
└── file1b
```

```js
const filesByDirectory = require('files-by-directory');

for await (const files of filesByDirectory(['level1'])) {
  console.log(files);
  console.log('---');
}
```

```
[
  'level1/file1a',
  'level1/file1b'
]
---
[
  'level1/level2a/file2a'
]
---
[
  'level1/level2a/level3/file3a',
  'level1/level2a/level3/file3b'
]
---
[
  'level1/level2b/file2b'
]
---
```

**Notes:**

- If a path is encountered twice, it is only generated once.
- Symbolic links are treated as regular files, even though they link to directories.

#### `options.excludeSymlinks` (default: `false`)

When set to `true`, excludes symbolic links from results:

```bash
# Directory structure:
level1
├── level2a
│   ├── file2a
│   └── file2b
├── level2b -> level2a
├── file1a
└── file1b -> file1a
```

```js
for await (const files of filesByDirectory(['level1']/*, { excludeSymlinks: false }*/} )) {
  console.log(files);
}
// [ 'level1/level2b', 'level1/file1a', 'level1/file1b' ]
// [ 'level2a/file2a', 'level2a/file2b' ]

for await (const files of filesByDirectory(['level1'], { excludeSymlinks: true })) {
  console.log(files);
}
// [ 'level1/file1a', 'level1/file1b' ]
// [ 'level2a/file2a', 'level2a/file2b' ]
```

#### `options.directoriesFirst` (default: `false`)

When set to `true`, proceed directories (recursively) before files.

```bash
# Directory structure:
level1
├── level2a
│   ├── level3
│   │   ├── file3a
│   │   └── file3b
│   └── file2a
├── level2b
│   └── file2b
├── file1a
└── file1b
```

```js
for await (const files of filesByDirectory(['level1']/*, { directoriesFirst: false }*/} )) {
  console.log(files);
}
// [ 'level1/file1a', 'level1/file1b' ]
// [ 'level1/level2a/file2a' ]
// [ 'level1/level2a/level3/file3a', 'level1/level2a/level3/file3b' ]
// [ 'level1/level2b/file2b' ]

for await (const files of filesByDirectory(['level1'], { directoriesFirst: true })) {
  console.log(files);
}
// [ 'level1/level2a/level3/file3a', 'level1/level2a/level3/file3b' ]
// [ 'level1/level2a/file2a' ]
// [ 'level1/level2b/file2b' ]
// [ 'level1/file1a', 'level1/file1b' ]
```

## Asynchronous iteration

[Asynchronous iteration] using `for-await-of` syntax requires Node 10+. For older version of NodeJS, either use:

- [Babel] with [@babel/transform-async-generator-functions], or
- Use `async/await` syntax without `for-await-of` (NodeJS 8+, see [demo-node-8.js](demo-node-8.js))
- Use Promises with a custom `invoke` function (NodeJS 6+, see [demo-node-6.js](demo-node-6.js))

## Contributing

Please refer to the [guidelines for contributing](./CONTRIBUTING.md).

[![devDependencies Status](https://david-dm.org/amercier/files-by-directory/dev-status.svg)](https://david-dm.org/amercier/files-by-directory?type=dev)

## License

[![License](https://img.shields.io/npm/l/files-by-directory.svg)](LICENSE.md)

---

[asynchronous iteration]: http://2ality.com/2016/10/asynchronous-iteration.html
[babel]: https://babeljs.io/
[@babel/transform-async-generator-functions]: https://babeljs.io/docs/en/babel-plugin-proposal-async-generator-functions

<sup>_Created with [npm-p&#97;ckage-skeleton](https://github.com/amercier/files-by-directory)._</sup>
