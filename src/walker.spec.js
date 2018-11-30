import '@babel/polyfill'; // Required for NodeJS < 10
import { values } from './async';
import File from './file';
import Walker from './walker';
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

const file1aFile = new File(file1a, false, false);
const level1File = new File(level1, true, false);
const level2File = new File(level2, true, false);
const level3File = new File(level3, true, false);
const linkToSiblingDirectoryFile = new File(linkToSiblingDirectory, false, true);
const linkToSiblingFileFile = new File(linkToSiblingFile, false, true);
const linkToUnexistingFileFile = new File(linkToUnexistingFile, false, true);
const unexistingFileFile = new File(unexistingFile, false, false);

describe('Walker', () => {
  describe('getChildren()', () => {
    it('returns an iterator', () => {
      const iterator = new Walker().getChildren((file1a, false));
      expect(iterator.next).toBeFunction();
    });

    it('generates a rejected Promise when file is a file', async () => {
      await expect(values(new Walker().getChildren(file1aFile))).toReject();
    });

    it('generates asynchronously File instance per child when file is a directory', async () => {
      expect(await values(new Walker().getChildren(level3File))).toMatchSnapshot();
      expect(await values(new Walker().getChildren(level2File))).toMatchSnapshot();
      expect(await values(new Walker().getChildren(level1File))).toMatchSnapshot();
    });

    it('generates a rejected Promise when file is an non-existing file', async () => {
      await expect(values(new Walker().getChildren(unexistingFileFile))).toReject();
    });

    it('generates a rejected Promise when file links to a file', async () => {
      await expect(values(new Walker().getFilesByDirectory(linkToSiblingFileFile))).toReject();
    });

    it('generates a rejected Promise when file links to a directory', async () => {
      await expect(values(new Walker().getFilesByDirectory(linkToSiblingDirectoryFile))).toReject();
    });

    it('generates a rejected Promise when file links to a non-existing file', async () => {
      await expect(values(new Walker().getFilesByDirectory(linkToUnexistingFileFile))).toReject();
    });
  });

  describe('getFilesByDirectory()', () => {
    it('returns an iterator', () => {
      const iterator = new Walker().getFilesByDirectory((file1a, false));
      expect(iterator.next).toBeFunction();
    });

    it('generates a rejected Promise when file is a file', async () => {
      await expect(values(new Walker().getFilesByDirectory(file1aFile))).toReject();
    });

    it('generates asynchronously one array of File instances per directory when file is a directory', async () => {
      expect(await values(new Walker().getFilesByDirectory(level3File))).toMatchSnapshot();
      expect(await values(new Walker().getFilesByDirectory(level2File))).toMatchSnapshot();
      expect(await values(new Walker().getFilesByDirectory(level1File))).toMatchSnapshot();
    });

    it('generates a rejected Promise when file is an non-existing file', async () => {
      await expect(values(new Walker().getFilesByDirectory(unexistingFileFile))).toReject();
    });

    it('generates a rejected Promise when file links to a file', async () => {
      await expect(values(new Walker().getFilesByDirectory(linkToSiblingFileFile))).toReject();
    });

    it('generates a rejected Promise when file links to a directory', async () => {
      await expect(values(new Walker().getFilesByDirectory(linkToSiblingDirectoryFile))).toReject();
    });

    it('generates a rejected Promise when file links to a non-existing file', async () => {
      await expect(values(new Walker().getFilesByDirectory(linkToUnexistingFileFile))).toReject();
    });
  });
});
