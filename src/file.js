import regeneratorRuntime from 'regenerator-runtime';
import { join } from 'path';
import { asyncFilter, asyncMap } from './async';
import { lStat, readDir } from './fs';
import defaults from './options';

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
   * @param {Object} options Traversing options, see {@link defaults}.
   * @returns {AsynchronousGenerator<File>} Generates one instance of File per child.
   */
  async *getChildren({ excludeSymlinks = defaults.excludeSymlinks } = {}) {
    if (!this.isDirectory) {
      throw new Error(`File is not a directory: ${this}`);
    }

    const children = this.constructor.readDir(this.path);
    yield* excludeSymlinks ? asyncFilter(children, child => !child.isSymbolicLink) : children;
  }

  /**
   * Generate array of File instances for each directory, recursively.
   *
   * @async
   * @generator
   * @param {Object} options Traversing options, see {@link defaults}.
   * @returns {AsynchronousGenerator<File[]>} Generates one array of File instances per directory.
   */
  async *getFilesByDirectory({
    directoriesFirst = defaults.directoriesFirst,
    showDirectories = defaults.showDirectories,
    ...otherOptions
  } = {}) {
    const options = { directoriesFirst, showDirectories, ...otherOptions };

    if (this.isDirectory) {
      const files = [];
      const directories = [];
      for await (const child of this.getChildren(options)) {
        if (child.isDirectory) {
          if (directoriesFirst) {
            yield* child.getFilesByDirectory(options);
          } else {
            directories.push(child);
          }
        } else {
          files.push(child);
        }
      }
      if (files.length > 0) {
        yield showDirectories ? [this, ...files] : files;
      }
      for (const directory of directories) {
        yield* directory.getFilesByDirectory(options);
      }
    } else {
      yield showDirectories ? [{}, this] : [this];
    }
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
    return new File(path, dirent.isDirectory(), dirent.isSymbolicLink());
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
    return new File(path, stats.isDirectory(), stats.isSymbolicLink());
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
    return asyncMap(paths, this.fromPath);
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
