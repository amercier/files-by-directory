import { join, relative } from 'path';

const cwd = process.cwd();

export const fixture = path => join(relative(cwd, __dirname), ...path.split('/'));
export const level2 = fixture('level1/level2');
export const level2Files = [
  fixture('level1/level2/file2a'),
  fixture('level1/level2/file2b'),
  fixture('level1/level2/link-to-directory'),
  fixture('level1/level2/link-to-grand-parent-directory'),
  fixture('level1/level2/link-to-parent-directory'),
];
export const level3 = fixture('level1/level2/level3');
export const level3Files = [
  fixture('level1/level2/level3/file3a'),
  fixture('level1/level2/level3/file3b'),
];
export const level2RegularFiles = [
  fixture('level1/level2/file2a'),
  fixture('level1/level2/file2b'),
];
export const existingFile = fixture('level1/file1a');
export const existingDirectory = level2;
export const unexistingFile = fixture('level1/unexisting-file');
export const symlinkToExistingFile = fixture('level1/link-to-sibling-file');
export const symlinkToExistingDirectory = fixture('level1/link-to-sibling-directory');
export const symlinkToUnexistingFile = fixture('level1/link-to-unexisting-file');
export const directoryWithoutSubdirectories = level3;
