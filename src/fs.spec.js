import '@babel/polyfill'; // Required for NodeJS < 10
import { lStat, isDir, readDir } from './fs';
import {
  existingFile,
  existingDirectory,
  unexistingFile,
  symlinkToExistingFile,
  symlinkToExistingDirectory,
  symlinkToUnexistingFile,
} from '../fixture';

/** @test {lStat} */
describe('lStat', () => {
  it('is a function', () => {
    expect(lStat).toBeFunction();
  });

  it('returns a Promise', () => {
    expect(lStat(existingFile)).toBeInstanceOf(Promise);
  });

  it('resolves when file exists', async () => {
    await expect(lStat(existingFile)).toResolve();
  });

  it('resolves to the correct stat when file exists', async () => {
    const stat = await lStat(existingFile);
    expect(stat.isFile()).toBe(true);
    expect(stat.isDirectory()).toBe(false);
    expect(stat.isSymbolicLink()).toBe(false);
  });

  it('resolves when directory exists', async () => {
    await expect(lStat(existingDirectory)).toResolve();
  });

  it('resolves to the correct stat when directory exists', async () => {
    const stat = await lStat(existingDirectory);
    expect(stat.isFile()).toBe(false);
    expect(stat.isDirectory()).toBe(true);
    expect(stat.isSymbolicLink()).toBe(false);
  });

  it('rejects when file does not exist', async () => {
    await expect(lStat(unexistingFile)).toReject();
  });

  it('resolves when symlink links to an existing file', async () => {
    await expect(lStat(symlinkToExistingFile)).toResolve();
  });

  it('resolves to the correct stat when symlink links to an existing file', async () => {
    const stat = await lStat(symlinkToExistingFile);
    expect(stat.isFile()).toBe(false);
    expect(stat.isDirectory()).toBe(false);
    expect(stat.isSymbolicLink()).toBe(true);
  });

  it('resolves when symlink links to an existing directory', async () => {
    await expect(lStat(symlinkToExistingDirectory)).toResolve();
  });

  it('resolves to the correct stat when symlink links to an existing directory', async () => {
    const stat = await lStat(symlinkToExistingDirectory);
    expect(stat.isFile()).toBe(false);
    expect(stat.isDirectory()).toBe(false);
    expect(stat.isSymbolicLink()).toBe(true);
  });

  it('resolves when symlink links to unexisting file', async () => {
    await expect(lStat(symlinkToUnexistingFile)).toResolve();
  });

  it('resolves to the correct stat symlink links to unexisting file', async () => {
    const stat = await lStat(symlinkToUnexistingFile);
    expect(stat.isFile()).toBe(false);
    expect(stat.isDirectory()).toBe(false);
    expect(stat.isSymbolicLink()).toBe(true);
  });
});

/** @test {isDir} */
describe('isDir', () => {
  it('is a function', () => {
    expect(isDir).toBeFunction();
  });

  it('is a function', () => {
    expect(isDir).toBeFunction();
  });

  it('returns a Promise', () => {
    expect(isDir(existingFile)).toBeInstanceOf(Promise);
  });

  it('resolves to false when file exists', async () => {
    expect(await isDir(existingFile)).toBe(false);
  });

  it('resolves to true when directory exists', async () => {
    expect(await isDir(existingDirectory)).toBe(true);
  });

  it('rejects when file does not exist', async () => {
    await expect(isDir(unexistingFile)).toReject();
  });

  it('resolves to false when symlink links to an existing file', async () => {
    expect(await isDir(symlinkToExistingFile)).toBe(false);
  });

  it('resolves to false when symlink links to an existing directory', async () => {
    expect(await isDir(symlinkToExistingDirectory)).toBe(false);
  });

  it('resolves to false when symlink links to unexisting file', async () => {
    expect(await isDir(symlinkToUnexistingFile)).toBe(false);
  });
});

/** @test {readDir} */
describe('readDir', () => {
  const expectedFiles = [
    'file2a',
    'file2b',
    'level3',
    'link-to-directory',
    'link-to-grand-parent-directory',
    'link-to-parent-directory',
  ];

  it('is a function', () => {
    expect(readDir).toBeFunction();
  });

  it('returns a Promise', () => {
    expect(isDir(existingDirectory)).toBeInstanceOf(Promise);
  });

  it('rejects when file is a regular file', async () => {
    await expect(readDir(existingFile)).toReject();
  });

  it('resolves to the list of files when directory exists', async () => {
    expect(await readDir(existingDirectory)).toEqual(expectedFiles);
  });

  it('rejects when file does not exist', async () => {
    await expect(readDir(unexistingFile)).toReject();
  });

  it('rejects when symlink links to a regular file', async () => {
    await expect(readDir(symlinkToExistingFile)).toReject();
  });

  it('resolves to the list of files when symlink links to an existing directory', async () => {
    expect(await readDir(symlinkToExistingDirectory)).toEqual(expectedFiles);
  });

  it('rejects when symlink links to unexisting file', async () => {
    await expect(readDir(symlinkToUnexistingFile)).toReject();
  });
});
