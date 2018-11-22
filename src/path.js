import escape from 'escape-string-regexp';
import { relative, sep } from 'path';

/**
 * Regular expression that matches all "ascendant" paths:
 * - '..'
 * - '../..'
 * - '../../..'
 * - etc.
 *
 * @type {RegExp}
 */
export const ascendanceRegExp = new RegExp(`^(${escape('..')}${escape(sep)})*${escape('..')}$`);

/**
 * Whether a path is an ascendant of another one.
 *
 * @param {string} subject ascendant path.
 * @param {string} descendant descendant path.
 * @returns {boolean} `true` if `subject` is an ascendant of `descendant`, `false` otherwise.
 */
export function isAscendant(subject, descendant) {
  return ascendanceRegExp.test(relative(descendant, subject));
}

/**
 * Whether a path is an descendant of another one.
 *
 * @param {string} subject descendant path.
 * @param {string} ascendant ascendant path.
 * @returns {boolean} `true` if `subject` is an ascendant of `ascendant`, `false` otherwise.
 */
export function isDescendant(subject, ascendant) {
  return isAscendant(ascendant, subject);
}

/**
 * Whether a path is unique and does not have any ascendant within an array of paths.
 *
 * @param {string} path A path.
 * @param {number} index Index of `path` with
 * @param {string[]} paths Array of paths.
 * @returns {boolean} `true` if `path` is both unique and do not have any ascendant within `paths`,
 * `false` otherwise.
 */
export function isUniqueAndNotDescendant(path, index, paths) {
  return paths.indexOf(path) === index && !paths.some(p => isAscendant(p, path));
}
