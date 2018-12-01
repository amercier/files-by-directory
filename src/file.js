import regeneratorRuntime from 'regenerator-runtime';
import { join } from 'path';
import { asyncMap } from './async';
import { lStat, readDir } from './fs';

/**
 * File
 */
export default class File {
  /**
   * Create an instance of File
   *
   * @param {string} path Path to a file, directory, or symlink
   * @param {boolean} isDirectory Whether the file is a directory or not. Symbolic links to
   * directories are not considered directories.
   * @param {boolean} isSymbolicLink Whether the file is a symbolic link.
   */
  constructor(path, isDirectory, isSymbolicLink) {
    this.path = path;
    this.isDirectory = isDirectory;
    this.isSymbolicLink = isSymbolicLink;
  }

  /**
   * @returns {string} A string representation of the file.
   */
  toString() {
    return this.path;
  }

  /**
   * Generate children of the file.
   *
   * @async
   * @generator
   * @returns {AsynchronousGenerator<File>} Generates one instance of File per child.
   */
  async *getChildren() {
    if (!this.isDirectory) {
      throw new Error(`File is not a directory: ${this}`);
    }

    yield* this.constructor.readDir(this.path);
  }

  /**
   * Create an instance of File from a `fs.Dirent` object of a file.
   *
   * @param {string} directory Parent directory of the file.
   * @param {fs.Dirent} dirent Dirent object of the file.
   * @returns {File} An instance of File representing the file.
   * @see {@link https://nodejs.org/api/fs.html#fs_class_fs_dirent|fs.Dirent}
   */
  static fromDirent(directory, dirent) {
    const path = join(directory, dirent.name);
    return new this(
      path,
      dirent.isSymbolicLink() ? undefined : dirent.isDirectory(),
      dirent.isSymbolicLink(),
    );
  }

  /**
   * Create an instance of File from a file path.
   *
   * @async
   * @param {string} path Path to the file.
   * @returns {Promise<File>} An instance of File representing the file.
   */
  static async fromPath(path) {
    const stats = await lStat(path);
    return new this(
      path,
      stats.isSymbolicLink() ? undefined : stats.isDirectory(),
      stats.isSymbolicLink(),
    );
  }

  /**
   * Generate instances of File from multiple paths.
   *
   * @async
   * @generator
   * @param {string[]} paths Paths of the file.
   * @returns {AsyncGenenerator<File>} One instance of File per path.
   */
  static fromPaths(paths) {
    return asyncMap(paths, this.fromPath.bind(this));
  }

  /**
   * Create instance of files from a directory path.
   *
   * @param {string} directory Directory path.
   * @returns {AsyncGenenerator<File>} An asynchronous generator of files.
   */
  static async *readDir(directory) {
    yield* asyncMap(await readDir(directory, { withFileTypes: true }), child =>
      typeof child === 'string'
        ? this.fromPath(join(directory, child)) // withFileTypes requires Node 10+
        : this.fromDirent(directory, child),
    );
  }
}
