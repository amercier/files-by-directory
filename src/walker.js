import regeneratorRuntime from 'regenerator-runtime';
import { dirname } from 'path';
import { asyncFilter } from './async';
import File from './file';
import defaults from './options';
import { isUniqueAndNotDescendant } from './path';

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

  /**
   * Generate array of File instances for each directory, recursively.
   *
   * Process directories first, then files. If multiple files belong to the same directory, they are
   * grouped together. If a path is encountered twice, it is only generated once. Symbolic links are
   * treated as regular files, even though they link to directories.
   *
   * @async
   * @generator
   * @param {string[]} paths Paths to files or directories.
   * @param {Object} options Traversing options, see {@link defaults}.
   * @return {AsyncIterator<File[]>} Generates one array of File instances per directory.
   */
  async *getFilesByDirectoryFromPaths(paths) {
    const regularFiles = {};
    const directories = [];

    for await (const file of File.fromPaths(paths.filter(isUniqueAndNotDescendant))) {
      if (file.isDirectory) {
        if (this.directoriesFirst) {
          yield* this.getFilesByDirectory(file);
        } else {
          directories.push(file);
        }
      } else if (!this.excludeSymlinks || !file.isSymbolicLink) {
        const parent = dirname(file.path);
        if (!regularFiles[parent]) {
          regularFiles[parent] = [];
        }
        regularFiles[parent].push(file);
      }
    }

    for (const files of Object.values(regularFiles)) {
      yield files;
    }

    for (const directory of directories) {
      yield* this.getFilesByDirectory(directory);
    }
  }
}
