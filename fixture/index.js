import { join, relative } from 'path';

const cwd = process.cwd();

export const fixture = (...args) => join(relative(cwd, __dirname), 'level1', ...args);
export const level2 = fixture('level2');
export const level2Files = [
  fixture('level2', 'file2a'),
  fixture('level2', 'file2b'),
  fixture('level2', 'link-to-directory'),
  fixture('level2', 'link-to-grand-parent-directory'),
  fixture('level2', 'link-to-parent-directory'),
];
export const level3 = fixture('level2', 'level3');
export const level3Files = [
  fixture('level2', 'level3', 'file3a'),
  fixture('level2', 'level3', 'file3b'),
];
export const level2RegularFiles = [fixture('level2', 'file2a'), fixture('level2', 'file2b')];
export const existingFile = fixture('file1a');
export const existingDirectory = level2;
export const unexistingFile = fixture('unexisting-file');
export const symlinkToExistingFile = fixture('link-to-sibling-file');
export const symlinkToExistingDirectory = fixture('link-to-sibling-directory');
export const symlinkToUnexistingFile = fixture('link-to-unexisting-file');
export const directoryWithoutSubdirectories = level3;
