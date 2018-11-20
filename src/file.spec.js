import '@babel/polyfill'; // Required for NodeJS < 10
import { values } from './async';
import File from './file';
import {
  existingFile,
  existingDirectory,
  unexistingFile,
  symlinkToExistingFile,
  symlinkToExistingDirectory,
  symlinkToUnexistingFile,
  directoryWithoutSubdirectories,
} from '../fixture';

describe('File', () => {
  describe('constructor()', () => {
    const file = new File('PATH', false);

    it('creates instances of File', () => {
      expect(file).toBeInstanceOf(File);
    });

    it('stores members', () => {
      expect(file.path).toBe('PATH');
      expect(file.isDirectory).toBe(false);
    });
  });

  describe('getChildren()', () => {
    it('returns an iterator', () => {
      const iterator = new File(existingFile, false).getChildren();
      expect(iterator.next).toBeFunction();
    });

    it('generates a rejected Promise whenever isDirectory is false', async () => {
      await expect(new File(existingFile, false).getChildren().next()).toReject();
      await expect(new File(existingDirectory, false).getChildren().next()).toReject();
      await expect(new File(unexistingFile, false).getChildren().next()).toReject();
      await expect(new File(symlinkToExistingFile, false).getChildren().next()).toReject();
      await expect(new File(symlinkToExistingDirectory, false).getChildren().next()).toReject();
      await expect(new File(symlinkToUnexistingFile, false).getChildren().next()).toReject();
    });

    describe('when isDirectory is true', () => {
      it('generates children asynchronously when file is a directory', async () => {
        expect(await values(new File(existingDirectory, true).getChildren())).toMatchSnapshot();
      });

      it('generates a rejected Promise when file is a file', async () => {
        await expect(new File(existingFile, true).getChildren().next()).toReject();
      });

      it('generates a rejected Promise when file is an unexisting file', async () => {
        await expect(new File(unexistingFile, true).getChildren().next()).toReject();
      });

      it('generates children asynchronously when symlink links to an existing directory', async () => {
        expect(
          await values(new File(symlinkToExistingDirectory, true).getChildren()),
        ).toMatchSnapshot();
      });

      it('generates a rejected Promise when symlink links to an existing file', async () => {
        await expect(new File(symlinkToExistingFile, true).getChildren().next()).toReject();
      });

      it('generates a rejected Promise when symlink links to unexisting file', async () => {
        await expect(new File(symlinkToUnexistingFile, true).getChildren().next()).toReject();
      });
    });
  });

  describe('getFilesByDirectory()', () => {
    it('returns an iterator', () => {
      const iterator = new File(existingFile, false).getFilesByDirectory();
      expect(iterator.next).toBeFunction();
    });

    it('generates asynchronously an array containing the file when path is a file', async () => {
      const directory = new File(existingFile, false);
      for await (const files of directory.getFilesByDirectory()) {
        expect(files).toMatchSnapshot();
      }
    });

    it('generates asynchronously an array of files when given path is a directory containing only files', async () => {
      const directory = new File(directoryWithoutSubdirectories, true);
      for await (const files of directory.getFilesByDirectory()) {
        expect(files).toMatchSnapshot();
      }
    });

    it('generates one array be directory when given path is a directory containing sub-directories', async () => {
      const directory = new File(existingDirectory, true);
      for await (const files of directory.getFilesByDirectory()) {
        expect(files).toMatchSnapshot();
      }
    });

    it('generates a rejected Promise when file is a file', async () => {
      await expect(new File(existingFile, true).getFilesByDirectory().next()).toReject();
    });

    it('generates a rejected Promise when file is an unexisting file', async () => {
      await expect(new File(unexistingFile, true).getFilesByDirectory().next()).toReject();
    });

    it('generates a rejected Promise when symlink links to an existing file', async () => {
      await expect(new File(symlinkToExistingFile, true).getFilesByDirectory().next()).toReject();
    });

    it('generates a rejected Promise when symlink links to unexisting file', async () => {
      await expect(new File(symlinkToUnexistingFile, true).getFilesByDirectory().next()).toReject();
    });
  });

  describe('static fromDirent()', () => {
    const path = 'PATH';
    const name = 'NAME';
    const isDirectory = () => true;

    it('creates instances of File', () => {
      expect(File.fromDirent(path, { name, isDirectory })).toBeInstanceOf(File);
    });

    it('it passes given path and name', () => {
      expect(File.fromDirent(path, { name, isDirectory }).path).toBe(`${path}/${name}`);
    });

    it('it uses given dirent to determine isDirectory', () => {
      expect(File.fromDirent(path, { name, isDirectory: () => true }).isDirectory).toBe(true);
      expect(File.fromDirent(path, { name, isDirectory: () => false }).isDirectory).toBe(false);
    });
  });

  describe('static fromPath()', () => {
    it('returns a Promise', () => {
      expect(File.fromPath(existingFile)).toBeInstanceOf(Promise);
    });

    it('resolves with an instance of File when file is a directory', async () => {
      await expect(File.fromPath(existingDirectory)).toResolve();
      expect(await File.fromPath(existingDirectory)).toMatchSnapshot();
    });

    it('resolves with an instance of File when file is a file', async () => {
      await expect(File.fromPath(existingFile)).toResolve();
      expect(await File.fromPath(existingFile)).toMatchSnapshot();
    });

    it('rejects when file is an unexisting file', async () => {
      await expect(File.fromPath(unexistingFile)).toReject();
    });

    it('resolves with and instance of File when symlink links to an existing directory', async () => {
      await expect(File.fromPath(symlinkToExistingDirectory)).toResolve();
      expect(await File.fromPath(symlinkToExistingDirectory)).toMatchSnapshot();
    });

    it('resolves with and instance of File when symlink links to an existing file', async () => {
      await expect(File.fromPath(symlinkToExistingFile)).toResolve();
      expect(await File.fromPath(symlinkToExistingFile)).toMatchSnapshot();
    });

    it('resolves with and instance of File when symlink links to unexisting file', async () => {
      await expect(File.fromPath(symlinkToUnexistingFile)).toResolve();
      expect(await File.fromPath(symlinkToUnexistingFile)).toMatchSnapshot();
    });
  });

  describe('static fromPaths()', () => {
    it('generates instances of File asynchronously', async () => {
      for await (const file of File.fromPaths([
        existingFile,
        existingDirectory,
        symlinkToExistingFile,
        symlinkToExistingDirectory,
        symlinkToUnexistingFile,
      ])) {
        expect(file).toMatchSnapshot();
      }
    });

    it('generates an error when an unexisting file is given', async () => {
      const iterator = File.fromPaths([unexistingFile]);
      await expect(iterator.next()).toReject();
    });
  });
});
