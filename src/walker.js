import regeneratorRuntime from 'regenerator-runtime';
import { asyncFilter, asyncMap } from './async';
import File from './file';
import defaults from './options';
import { byDirname, isUniqueAndNotDescendant } from './path';

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
   * Get files according to Walker settings: exclude symbolic links if `excludeSymlinks` is `true`.
   *
   * @async
   * @generator
   * @param {Iterable<File>} files File synchronous or asynchronous iterator.
   * @returns {AsynchronousGenerator<File>} Processed files.
   */
  async *getFiles(files) {
    if (this.excludeSymlinks) {
      yield* asyncFilter(files, child => !child.isSymbolicLink);
    } else if (this.followSymlinks) {
      yield* asyncMap(files, child => child.followSymbolicLink());
    } else {
      yield* files;
    }
  }

  /**
   * Generate one File instance for each child.
   *
   * @async
   * @generator
   * @returns {AsynchronousGenerator<File>} Generates one file instance per child.
   */
  async *getChildren(file) {
    yield* this.getFiles(file.getChildren());
  }

  /**
   * Iterate over an iterator of File instance, and yield
   * - values returned by `directoryCallback(directory: File)` on each directory
   * - values returned by `filesCallback(regularFiles: File[])` on all regular files
   * - or, the other way around if `directoriesFirst` option is `false`.
   *
   * @async
   * @generator
   * @param {Iterable<File>} files File synchronous or asynchronous iterator.
   * @param {Function(File): AsynchronousGenerator<File>} directoryCallback Directory callback.
   * @param {Function(File[]): AsynchronousGenerator<File>} filesCallback Regular files callback.
   * @returns {AsynchronousGenerator<File>} Files instances generated by `directoryCallback` and
   * `filesCallback`.
   */
  async *walkFiles(files, directoryCallback, filesCallback) {
    const regularFiles = [];
    const remainingDirectories = [];

    for await (const file of files) {
      if (!file.isDirectory) {
        regularFiles.push(file);
      } else if (this.directoriesFirst) {
        yield* directoryCallback(file);
      } else {
        remainingDirectories.push(file);
      }
    }

    // Process regular files, if any
    if (regularFiles.length > 0) {
      yield* filesCallback(regularFiles);
    }

    // Process regular files, if any left (directoriesFirst = true)
    for (const directory of remainingDirectories) {
      yield* directoryCallback(directory);
    }
  }

  /**
   * Generate array of File instances for each directory, recursively.
   *
   * @async
   * @generator
   * @returns {AsynchronousGenerator<File[]>} Generates one array of File instances per directory.
   */
  getFilesByDirectory(file) {
    return this.walkFiles(
      this.getChildren(file),
      directory => this.getFilesByDirectory(directory),
      files => [this.showDirectories ? [file, ...files] : files],
    );
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
  getFilesByDirectoryFromPaths(paths) {
    return this.walkFiles(
      this.getFiles(File.fromPaths(paths.filter(isUniqueAndNotDescendant))),
      directory => this.getFilesByDirectory(directory),
      files => Object.values(byDirname(files)),
    );
  }
}
