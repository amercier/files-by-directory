import { dirname } from 'path';
import regeneratorRuntime from 'regenerator-runtime';
import { asyncMap } from './async';
import File from './file';
import { isUniqueAndNotDescendant } from './path';
import Walker from './walker';

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
async function* fileObjectsByDirectory(paths, options = {}) {
  const regularFiles = {};
  const directories = [];
  const walker = new Walker(options);

  for await (const file of File.fromPaths(paths.filter(isUniqueAndNotDescendant))) {
    if (file.isDirectory) {
      if (options.directoriesFirst) {
        yield* walker.getFilesByDirectory(file);
      } else {
        directories.push(file);
      }
    } else if (!options.excludeSymlinks || !file.isSymbolicLink) {
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
    yield* walker.getFilesByDirectory(directory);
  }
}

/**
 * Generate array of file paths for each directory, recursively.
 *
 * Process directories first, then files. If multiple files belong to the same directory, they are
 * grouped together. If a path is encountered twice, it is only generated once. Symbolic links are
 * treated as regular files, even though they link to directories.
 *
 * @async
 * @generator
 * @param {string[]} paths Paths to files or directories.
 * @param {Object} options Traversing options, see {@link defaults}.
 * @return {AsyncIterator<string[]>} Generates one array of file paths per directory.
 */
export default async function* filesByDirectory(paths, options) {
  yield* asyncMap(fileObjectsByDirectory(paths, options), files => files.map(file => file.path));
}
