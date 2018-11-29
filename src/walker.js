import regeneratorRuntime from 'regenerator-runtime';
import { asyncFilter } from './async';
import defaults from './options';

/**
 * File system walker.
 */
export default class Walker {
  /**
   * Create a Walker instance.
   *
   * @param {Object} options Traversing options, see {@link defaults}.
   */
  constructor(options) {
    Object.assign(this, defaults, options);
  }

  /**
   * Generate one File instance for each child.
   *
   * @async
   * @generator
   * @returns {AsynchronousGenerator<File>} Generates one file instance per child.
   */
  async *getChildren(file) {
    const children = file.getChildren();
    if (this.excludeSymlinks) {
      yield* asyncFilter(children, child => !child.isSymbolicLink);
    } else {
      yield* children;
    }
  }

  /**
   * Generate array of File instances for each directory, recursively.
   *
   * @async
   * @generator
   * @returns {AsynchronousGenerator<File[]>} Generates one array of File instances per directory.
   */
  async *getFilesByDirectory(file) {
    const files = [];
    const directories = [];

    for await (const child of this.getChildren(file)) {
      if (!child.isDirectory) {
        files.push(child);
      } else if (this.directoriesFirst) {
        yield* this.getFilesByDirectory(child);
      } else {
        directories.push(child);
      }
    }

    // Yield files array, if any
    if (files.length > 0) {
      yield this.showDirectories ? [file, ...files] : files;
    }

    // Yield directory arrays, if any (directoriesFirst = true)
    for (const directory of directories) {
      yield* this.getFilesByDirectory(directory);
    }
  }
}
