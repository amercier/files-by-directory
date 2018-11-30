import '@babel/polyfill'; // Required for NodeJS < 10
import { basename } from 'path';
import { values } from './async';
import File from './file';
import {
  file1a,
  level1,
  level2,
  level3,
  linkToSiblingDirectory,
  linkToSiblingFile,
  linkToUnexistingFile,
  unexistingFile,
} from '../fixture';

const file1aArgs = [file1a, false, false];
const level1Args = [level1, true, false];
const level2Args = [level2, true, false];
const level3Args = [level3, true, false];
const linkToSiblingDirectoryArgs = [linkToSiblingDirectory, false, true];
const linkToSiblingFileArgs = [linkToSiblingFile, false, true];
const linkToUnexistingFileArgs = [linkToUnexistingFile, false, true];
const unexistingFileArgs = [unexistingFile, false, false];

describe('File', () => {
  describe('constructor()', () => {
    it('creates instances of File', () => {
      expect(new File(...file1aArgs)).toBeInstanceOf(File);
      expect(new File(...level1Args)).toBeInstanceOf(File);
      expect(new File(...level2Args)).toBeInstanceOf(File);
      expect(new File(...level3Args)).toBeInstanceOf(File);
      expect(new File(...unexistingFileArgs)).toBeInstanceOf(File);
      expect(new File(...linkToSiblingDirectoryArgs)).toBeInstanceOf(File);
      expect(new File(...linkToSiblingFileArgs)).toBeInstanceOf(File);
      expect(new File(...linkToUnexistingFileArgs)).toBeInstanceOf(File);
    });

    it('stores path', () => {
      expect(new File(...file1aArgs).path).toBe(file1aArgs[0]);
      expect(new File(...level1Args).path).toBe(level1Args[0]);
      expect(new File(...level2Args).path).toBe(level2Args[0]);
      expect(new File(...level3Args).path).toBe(level3Args[0]);
      expect(new File(...unexistingFileArgs).path).toBe(unexistingFileArgs[0]);
      expect(new File(...linkToSiblingDirectoryArgs).path).toBe(linkToSiblingDirectoryArgs[0]);
      expect(new File(...linkToSiblingFileArgs).path).toBe(linkToSiblingFileArgs[0]);
      expect(new File(...linkToUnexistingFileArgs).path).toBe(linkToUnexistingFileArgs[0]);
    });

    it('stores isDirectory', () => {
      expect(new File(...file1aArgs).isDirectory).toBe(file1aArgs[1]);
      expect(new File(...level1Args).isDirectory).toBe(level1Args[1]);
      expect(new File(...level2Args).isDirectory).toBe(level2Args[1]);
      expect(new File(...level3Args).isDirectory).toBe(level3Args[1]);
      expect(new File(...unexistingFileArgs).isDirectory).toBe(unexistingFileArgs[1]);
      expect(new File(...linkToSiblingDirectoryArgs).isDirectory).toBe(
        linkToSiblingDirectoryArgs[1],
      );
      expect(new File(...linkToSiblingFileArgs).isDirectory).toBe(linkToSiblingFileArgs[1]);
      expect(new File(...linkToUnexistingFileArgs).isDirectory).toBe(linkToUnexistingFileArgs[1]);
    });
  });

  describe('getChildren()', () => {
    it('returns an iterator', () => {
      const iterator = new File(file1a, false).getChildren();
      expect(iterator.next).toBeFunction();
    });

    it('generates a rejected Promise when file is a file', async () => {
      await expect(values(new File(...file1aArgs).getChildren())).toReject();
    });

    it('generates asynchronously one File instance per child when file is a directory', async () => {
      expect(await values(new File(...level1Args).getChildren())).toMatchSnapshot();
      expect(await values(new File(...level2Args).getChildren())).toMatchSnapshot();
      expect(await values(new File(...level3Args).getChildren())).toMatchSnapshot();
    });

    it('generates a rejected Promise when file does not exist', async () => {
      await expect(values(new File(...unexistingFileArgs).getChildren())).toReject();
    });

    it('generates a rejected Promise when file links to a file', async () => {
      await expect(values(new File(...linkToSiblingFile).getChildren())).toReject();
    });

    it('generates a rejected Promise when file links to a directory', async () => {
      await expect(values(new File(...linkToSiblingDirectoryArgs).getChildren())).toReject();
    });

    it('generates a rejected Promise when file links to a non-existing file', async () => {
      await expect(values(new File(...linkToUnexistingFile).getChildren())).toReject();
    });
  });

  describe('static fromDirent()', () => {
    const argsToDirent = ([path, isDirectory, isSymbolicLink]) => ({
      name: basename(path),
      isDirectory: () => isDirectory,
      isSymbolicLink: () => isSymbolicLink,
    });
    const file1aDirent = argsToDirent(file1aArgs);
    const level2Dirent = argsToDirent(level2Args);
    const level3Dirent = argsToDirent(level3Args);
    const unexistingFileDirent = argsToDirent(unexistingFileArgs);
    const linkToSiblingDirectoryDirent = argsToDirent(linkToSiblingDirectoryArgs);
    const linkToSiblingFileDirent = argsToDirent(linkToSiblingFileArgs);
    const linkToUnexistingFileDirent = argsToDirent(linkToUnexistingFileArgs);

    it('creates instances of File', () => {
      expect(File.fromDirent(level1, file1aDirent)).toBeInstanceOf(File);
    });

    it('it passes given path and name', () => {
      expect(File.fromDirent(level1, file1aDirent).path).toBe(file1a);
      expect(File.fromDirent(level1, level2Dirent).path).toBe(level2);
      expect(File.fromDirent(level2, level3Dirent).path).toBe(level3);
      expect(File.fromDirent(level1, unexistingFileDirent).path).toBe(unexistingFile);
      expect(File.fromDirent(level1, linkToSiblingFileDirent).path).toBe(linkToSiblingFile);
      expect(File.fromDirent(level1, linkToSiblingDirectoryDirent).path).toBe(
        linkToSiblingDirectory,
      );
      expect(File.fromDirent(level1, linkToUnexistingFileDirent).path).toBe(linkToUnexistingFile);
    });

    it('it uses given dirent to determine isDirectory', () => {
      expect(File.fromDirent(level1, file1aDirent).isDirectory).toBe(file1aArgs[1]);
      expect(File.fromDirent(level1, level2Dirent).isDirectory).toBe(level2Args[1]);
      expect(File.fromDirent(level2, level3Dirent).isDirectory).toBe(level3Args[1]);
      expect(File.fromDirent(level1, linkToUnexistingFileDirent).isDirectory).toBe(
        linkToUnexistingFileArgs[1],
      );
      expect(File.fromDirent(level1, linkToSiblingFileDirent).isDirectory).toBe(
        linkToSiblingFileArgs[1],
      );
      expect(File.fromDirent(level1, linkToSiblingDirectoryDirent).isDirectory).toBe(
        linkToSiblingDirectoryArgs[1],
      );
      expect(File.fromDirent(level1, unexistingFileDirent).isDirectory).toBe(unexistingFileArgs[1]);
    });

    it('it uses given dirent to determine isSymbolicLink', () => {
      expect(File.fromDirent(level1, file1aDirent).isSymbolicLink).toBe(file1aArgs[2]);
      expect(File.fromDirent(level1, level2Dirent).isSymbolicLink).toBe(level2Args[2]);
      expect(File.fromDirent(level2, level3Dirent).isSymbolicLink).toBe(level3Args[2]);
      expect(File.fromDirent(level1, unexistingFileDirent).isSymbolicLink).toBe(
        unexistingFileArgs[2],
      );
      expect(File.fromDirent(level1, linkToSiblingFileDirent).isSymbolicLink).toBe(
        linkToSiblingFileArgs[2],
      );
      expect(File.fromDirent(level1, linkToSiblingDirectoryDirent).isSymbolicLink).toBe(
        linkToSiblingDirectoryArgs[2],
      );
      expect(File.fromDirent(level1, linkToUnexistingFileDirent).isSymbolicLink).toBe(
        linkToUnexistingFileArgs[2],
      );
    });
  });

  describe('static fromPath()', () => {
    it('returns a Promise', () => {
      expect(File.fromPath(file1a)).toBeInstanceOf(Promise);
    });

    it('resolves with an instance of File when file is a directory', async () => {
      await expect(File.fromPath(level2)).toResolve();
      expect(await File.fromPath(level2)).toMatchSnapshot();
    });

    it('resolves with an instance of File when file is a file', async () => {
      await expect(File.fromPath(file1a)).toResolve();
      expect(await File.fromPath(file1a)).toMatchSnapshot();
    });

    it('rejects when file is an non-existing file', async () => {
      await expect(File.fromPath(unexistingFile)).toReject();
    });

    it('resolves with and instance of File when symlink links to a file', async () => {
      await expect(File.fromPath(linkToSiblingFile)).toResolve();
      expect(await File.fromPath(linkToSiblingFile)).toMatchSnapshot();
    });

    it('resolves with and instance of File when symlink links to a directory', async () => {
      await expect(File.fromPath(linkToSiblingDirectory)).toResolve();
      expect(await File.fromPath(linkToSiblingDirectory)).toMatchSnapshot();
    });

    it('resolves with and instance of File when symlink links to non-existing file', async () => {
      await expect(File.fromPath(linkToUnexistingFile)).toResolve();
      expect(await File.fromPath(linkToUnexistingFile)).toMatchSnapshot();
    });
  });

  describe('static fromPaths()', () => {
    it('generates instances of File asynchronously', async () => {
      for await (const file of File.fromPaths([
        file1a,
        level2,
        linkToSiblingFile,
        linkToSiblingDirectory,
        linkToUnexistingFile,
      ])) {
        expect(file).toMatchSnapshot();
      }
    });

    it('generates a rejected Promise when an non-existing file is given', async () => {
      const iterator = File.fromPaths([unexistingFile]);
      await expect(iterator.next()).toReject();
    });
  });

  describe('static readDir()', () => {
    it('generates a rejected Promise when path is a file', async () => {
      await expect(values(File.readDir(file1a))).toReject();
    });

    it('generates asynchronously one File instance per child when path is a directory', async () => {
      expect(await values(File.readDir(level3))).toMatchSnapshot();
      expect(await values(File.readDir(level2))).toMatchSnapshot();
      expect(await values(File.readDir(level1))).toMatchSnapshot();
    });

    it('generates a rejected Promise when path is a non-existing file', async () => {
      await expect(values(File.readDir(unexistingFile))).toReject();
    });

    it('generates a rejected Promise when path links to a file', async () => {
      await expect(values(File.readDir(linkToSiblingFile))).toReject();
    });

    it('generates asynchronously one File instance per child when path links to a directory', async () => {
      expect(await values(File.readDir(linkToSiblingDirectory))).toMatchSnapshot();
    });

    it('generates a rejected Promise when path links to a non-existing file', async () => {
      await expect(values(File.readDir(linkToUnexistingFile))).toReject();
    });
  });
});
