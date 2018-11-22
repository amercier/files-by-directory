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
