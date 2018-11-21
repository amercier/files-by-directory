import { join, relative } from 'path';

const cwd = process.cwd();

export const fixture = (...args) => join(relative(cwd, __dirname), 'level1', ...args);
export const existingFile = fixture('file1a');
export const existingDirectory = fixture('level2');
export const unexistingFile = fixture('unexisting-file');
export const symlinkToExistingFile = fixture('link-to-sibling-file');
export const symlinkToExistingDirectory = fixture('link-to-sibling-directory');
export const symlinkToUnexistingFile = fixture('link-to-unexisting-file');
export const directoryWithoutSubdirectories = fixture('level2', 'level3');
