import '@babel/polyfill'; // Required for NodeJS < 10
import { values } from './async';
import getFilesByDirectory from './files-by-directory';
import defaults from './options';
import {
  file1a,
  level1,
  level2,
  level2Files,
  level3,
  level3Files,
  emptyDirectory,
} from '../fixture';

/** @test {filesByDirectory} */
describe('filesByDirectory', () => {
  it('returns an asynchronousiterator', () => {
    const iterator = getFilesByDirectory([file1a]);
    expect(iterator.next).toBeFunction();
    expect(iterator.next()).toBeInstanceOf(Promise);
  });

  it('generates asynchronously an array containing the file when path is a file', async () => {
    expect(await values(getFilesByDirectory([file1a]))).toMatchSnapshot();
  });

  it('generates asynchronously an array of files when given path is a directory containing only files', async () => {
    expect(await values(getFilesByDirectory([level3]))).toMatchSnapshot();
  });

  it('generates one array per directory when given path is a directory containing sub-directories', async () => {
    expect(await values(getFilesByDirectory([level2]))).toMatchSnapshot();
  });

  it('omits double directory paths', async () => {
    expect(await values(getFilesByDirectory([level3, level3]))).toMatchSnapshot();
  });

  it('omits double file paths', async () => {
    expect(await values(getFilesByDirectory([file1a, file1a]))).toMatchSnapshot();
  });

  it('omits descendant directory paths', async () => {
    expect(await values(getFilesByDirectory([level2, level3]))).toMatchSnapshot();
    expect(await values(getFilesByDirectory([level3, level2]))).toMatchSnapshot();
  });

  it('omits descendant file paths', async () => {
    expect(await values(getFilesByDirectory([level3, level3Files[0]]))).toMatchSnapshot();
    expect(await values(getFilesByDirectory([level3Files[0], level3]))).toMatchSnapshot();
  });

  it('groups regular files by parent path', async () => {
    expect(await values(getFilesByDirectory(level3Files))).toMatchSnapshot();
    expect(await values(getFilesByDirectory([...level2Files, ...level3Files]))).toMatchSnapshot();
    expect(await values(getFilesByDirectory([...level3Files, ...level2Files]))).toMatchSnapshot();
  });

  describe('options', () => {
    async function testGetFilesByDirectoryWithOptions(options) {
      expect(await values(getFilesByDirectory([level3], options))).toMatchSnapshot();
      expect(await values(getFilesByDirectory([level2], options))).toMatchSnapshot();
      expect(await values(getFilesByDirectory([level1], options))).toMatchSnapshot();
      expect(
        await values(getFilesByDirectory([level3, ...level2Files], options)),
      ).toMatchSnapshot();
    }

    describe('excludeSymlinks', () => {
      it('is false by default', () => {
        expect(defaults.excludeSymlinks).toBe(false);
      });

      it('excludes symbolic links when excludeSymlinks is true', async () => {
        await testGetFilesByDirectoryWithOptions({ excludeSymlinks: true });
      });

      it('includes symbolic links when excludeSymlinks is false', async () => {
        await testGetFilesByDirectoryWithOptions({ excludeSymlinks: false });
      });
    });

    describe('directoriesFirst', () => {
      it('is false by default', () => {
        expect(defaults.excludeSymlinks).toBe(false);
      });

      it('generates files first when directoriesFirst is true', async () => {
        await testGetFilesByDirectoryWithOptions({ directoriesFirst: true });
      });

      it('generates directories first when directoriesFirst is false', async () => {
        await testGetFilesByDirectoryWithOptions({ directoriesFirst: false });
      });
    });

    describe('showDirectories', () => {
      it('is false by default', () => {
        expect(defaults.showDirectories).toBe(false);
      });

      it('generates files with their directory when showDirectories is true', async () => {
        await testGetFilesByDirectoryWithOptions({ showDirectories: true });
      });

      it('generates files without their directory when showDirectories is false', async () => {
        await testGetFilesByDirectoryWithOptions({ showDirectories: false });
      });
    });

    describe('followSymlinks', () => {
      it('is false by default', () => {
        expect(defaults.followSymlinks).toBe(false);
      });

      it('does not resolve symbolic links when followSymlinks is false', async () => {
        const options = { followSymlinks: false };
        expect(await values(getFilesByDirectory([level3], options))).toMatchSnapshot();
        expect(await values(getFilesByDirectory([level2], options))).toMatchSnapshot();
        expect(
          await values(getFilesByDirectory([level3, ...level2Files], options)),
        ).toMatchSnapshot();
      });

      it('resolves symbolic links when followSymlinks is true', async () => {
        const options = { followSymlinks: true };
        expect(await values(getFilesByDirectory([level3], options))).toMatchSnapshot();
        expect(await values(getFilesByDirectory([level2], options))).toMatchSnapshot();
        expect(
          await values(getFilesByDirectory([level3, ...level2Files], options)),
        ).toMatchSnapshot();
      });
    });

    describe('skipEmptyDirectories', () => {
      it('is true by default', () => {
        expect(defaults.skipEmptyDirectories).toBe(true);
      });

      it('skips empty directories when skipEmptyDirectories is true', async () => {
        expect(
          await values(
            getFilesByDirectory([emptyDirectory, level3], {
              skipEmptyDirectories: true,
            }),
          ),
        ).toMatchSnapshot();
      });

      it('includes empty directories when skipEmptyDirectories is false', async () => {
        expect(
          await values(
            getFilesByDirectory([emptyDirectory, level3], {
              skipEmptyDirectories: false,
            }),
          ),
        ).toMatchSnapshot();
      });
    });
  });
});
