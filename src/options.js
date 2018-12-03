/**
 * Default traversing options.
 *
 * @type {Object}
 * @property {boolean} excludeSymlinks Whether to exclude symbolic links or not.
 * @property {boolean} directoriesFirst Whether to list directories before files.
 * @property {boolean} showDirectories Whether to include directories as the first entry of the
 * @property {boolean} followSymlinks Whether to follow symbolic links or not.
 * @property {boolean} skipEmptyDirectories Whether to skip empty directories, or include them.
 * result arrays.
 */
const defaults = {
  excludeSymlinks: false,
  directoriesFirst: false,
  showDirectories: false,
  followSymlinks: false,
  skipEmptyDirectories: true,
};

export default defaults;
