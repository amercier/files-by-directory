/**
 * Default traversing options.
 *
 * @type {Object}
 * @property {boolean} excludeSymlinks Whether to exclude symbolic links or not.
 * @property {boolean} directoriesFirst Whether to list directories before files.
 * @property {boolean} showDirectories Whether to include directories as the first entry of the
 * result arrays.
 */
const defaults = {
  excludeSymlinks: false,
  directoriesFirst: false,
  showDirectories: false,
};

export default defaults;
