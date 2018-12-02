import '@babel/polyfill'; // Required for NodeJS < 10
import { lStat, isDir, readDir, stat } from './fs';
import {
  file1a,
  level2,
  linkToSiblingDirectory,
  linkToSiblingFile,
  linkToUnexistingFile,
  unexistingFile,
} from '../fixture';

/** @test {stat} */
describe('stat', () => {
  it('is a function', () => {
    expect(stat).toBeFunction();
  });

  it('returns a Promise', () => {
    expect(stat(file1a)).toBeInstanceOf(Promise);
  });

  it('resolves when file exists', async () => {
    await expect(stat(file1a)).toResolve();
  });

  it('resolves to the correct stat when file exists', async () => {
    const stats = await stat(file1a);
    expect(stats.isFile()).toBe(true);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(false);
  });

  it('resolves when directory exists', async () => {
    await expect(stat(level2)).toResolve();
  });

  it('resolves to the correct stat when directory exists', async () => {
    const stats = await stat(level2);
    expect(stats.isFile()).toBe(false);
    expect(stats.isDirectory()).toBe(true);
    expect(stats.isSymbolicLink()).toBe(false);
  });

  it('rejects when file does not exist', async () => {
    await expect(stat(unexistingFile)).toReject();
  });

  it('resolves when symlink links to an existing file', async () => {
    await expect(stat(linkToSiblingFile)).toResolve();
  });

  it('resolves to the correct stat when symlink links to an existing file', async () => {
    const stats = await stat(linkToSiblingFile);
    expect(stats.isFile()).toBe(true);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(false);
  });

  it('resolves when symlink links to an existing directory', async () => {
    await expect(stat(linkToSiblingDirectory)).toResolve();
  });

  it('resolves to the correct stat when symlink links to an existing directory', async () => {
    const stats = await stat(linkToSiblingDirectory);
    expect(stats.isFile()).toBe(false);
    expect(stats.isDirectory()).toBe(true);
    expect(stats.isSymbolicLink()).toBe(false);
  });

  it('rejects when symlink links to unexisting file', async () => {
    await expect(stat(linkToUnexistingFile)).toReject();
  });
});

/** @test {lStat} */
describe('lStat', () => {
  it('is a function', () => {
    expect(lStat).toBeFunction();
  });

  it('returns a Promise', () => {
    expect(lStat(file1a)).toBeInstanceOf(Promise);
  });

  it('resolves when file exists', async () => {
    await expect(lStat(file1a)).toResolve();
  });

  it('resolves to the correct stat when file exists', async () => {
    const stats = await lStat(file1a);
    expect(stats.isFile()).toBe(true);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(false);
  });

  it('resolves when directory exists', async () => {
    await expect(lStat(level2)).toResolve();
  });

  it('resolves to the correct stat when directory exists', async () => {
    const stats = await lStat(level2);
    expect(stats.isFile()).toBe(false);
    expect(stats.isDirectory()).toBe(true);
    expect(stats.isSymbolicLink()).toBe(false);
  });

  it('rejects when file does not exist', async () => {
    await expect(lStat(unexistingFile)).toReject();
  });

  it('resolves when symlink links to an existing file', async () => {
    await expect(lStat(linkToSiblingFile)).toResolve();
  });

  it('resolves to the correct stat when symlink links to an existing file', async () => {
    const stats = await lStat(linkToSiblingFile);
    expect(stats.isFile()).toBe(false);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(true);
  });

  it('resolves when symlink links to an existing directory', async () => {
    await expect(lStat(linkToSiblingDirectory)).toResolve();
  });

  it('resolves to the correct stat when symlink links to an existing directory', async () => {
    const stats = await lStat(linkToSiblingDirectory);
    expect(stats.isFile()).toBe(false);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(true);
  });

  it('resolves when symlink links to unexisting file', async () => {
    await expect(lStat(linkToUnexistingFile)).toResolve();
  });

  it('resolves to the correct stat when symlink links to unexisting file', async () => {
    const stats = await lStat(linkToUnexistingFile);
    expect(stats.isFile()).toBe(false);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isSymbolicLink()).toBe(true);
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
    expect(isDir(file1a)).toBeInstanceOf(Promise);
  });

  it('resolves to false when file exists', async () => {
    expect(await isDir(file1a)).toBe(false);
  });

  it('resolves to true when directory exists', async () => {
    expect(await isDir(level2)).toBe(true);
  });

  it('rejects when file does not exist', async () => {
    await expect(isDir(unexistingFile)).toReject();
  });

  it('resolves to false when symlink links to an existing file', async () => {
    expect(await isDir(linkToSiblingFile)).toBe(false);
  });

  it('resolves to false when symlink links to an existing directory', async () => {
    expect(await isDir(linkToSiblingDirectory)).toBe(false);
  });

  it('resolves to false when symlink links to unexisting file', async () => {
    expect(await isDir(linkToUnexistingFile)).toBe(false);
  });
});

/** @test {readDir} */
describe('readDir', () => {
  it('is a function', () => {
    expect(readDir).toBeFunction();
  });

  it('returns a Promise', () => {
    expect(isDir(level2)).toBeInstanceOf(Promise);
  });

  it('rejects when file is a regular file', async () => {
    await expect(readDir(file1a)).toReject();
  });

  it('resolves to the list of files when directory exists', async () => {
    expect(await readDir(level2)).toMatchSnapshot();
  });

  it('rejects when file does not exist', async () => {
    await expect(readDir(unexistingFile)).toReject();
  });

  it('rejects when symlink links to a regular file', async () => {
    await expect(readDir(linkToSiblingFile)).toReject();
  });

  it('resolves to the list of files when symlink links to an existing directory', async () => {
    expect(await readDir(linkToSiblingDirectory)).toMatchSnapshot();
  });

  it('rejects when symlink links to unexisting file', async () => {
    await expect(readDir(linkToUnexistingFile)).toReject();
  });
});
