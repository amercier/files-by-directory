import { lstat, readdir } from 'fs';
import { promisify } from './async';

/**
 * Promisified version of `fs.lstat()`: asynchronous `lstat(2)`.
 *
 * @see {@link http://man7.org/linux/man-pages/man2/stat.2.html|lstat(2)}
 * @see {@link https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback|fs.lstat()}
 *
 * @async
 * @param {string|Buffer|URL} path
 * @param {Object} options Options passed to `fs.lstat()` (optional).
 * @return {Promise<fs.Stats>} The `fs.Stats` object.
 */
export const lStat = promisify(lstat);

/**
 * Promisified version of `fs.readdir()`: asynchronous `readdir(3)`.
 *
 * @see {@link http://man7.org/linux/man-pages/man3/readdir.3.html|readdir(3)}
 * @see {@link https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback|fs.readdir()}
 *
 * @async
 * @param {string|Buffer|URL} path
 * @param {Object} options Options passed to `fs.readdir()` (optional).
 * @return {Promise<string[]|Buffer[]|fs.Dirent[]>} Files.
 */
export const readDir = promisify(readdir);

/**
 * Whether a file is a directory or not.
 *
 * @async
 * @param {string|Buffer|URL} path
 * @return {Promise<boolean>} `true` if the file is a directory, false otherwise.
 */
export const isDir = path => lStat(path).then(stats => stats.isDirectory());
