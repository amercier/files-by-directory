import regeneratorRuntime from 'regenerator-runtime';
import { asyncMap } from './async';
import Walker from './walker';

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
  yield* asyncMap(new Walker(options).getFilesByDirectoryFromPaths(paths), files =>
    files.map(file => file.path),
  );
}
