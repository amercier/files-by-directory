import regeneratorRuntime from 'regenerator-runtime';
import { asyncMap, asyncFlattenMap, values } from './async';
import File from './file';
import { isDescendant } from './path';

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
 * @yields {Promise<File[]>} Generates one array of File instances per directory.
 */
export default async function* filesByDirectory(paths) {
  // Remove doubles and descendant paths
  const cleanPaths = paths.filter(
    (path, i) => !paths.some((other, j) => (j > i && path === other) || isDescendant(path, other)),
  );

  const unordered = await values(File.fromPaths(cleanPaths));
  const ordered = [
    ...unordered.filter(file => file.isDirectory),
    ...unordered.filter(file => !file.isDirectory),
  ];

  yield* asyncMap(asyncFlattenMap(ordered, file => file.getFilesByDirectory()), files =>
    files.map(file => file.path),
  );
}
