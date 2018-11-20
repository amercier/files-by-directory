import '@babel/polyfill'; // Required for NodeJS < 10
import { values } from './async';
import getFilesByDirectory from './files-by-directory';
import { existingFile, existingDirectory, directoryWithoutSubdirectories } from '../fixture';

/** @test {filesByDirectory} */
describe('filesByDirectory', () => {
  it('returns an asynchronousiterator', () => {
    const iterator = getFilesByDirectory([existingFile]);
    expect(iterator.next).toBeFunction();
    expect(iterator.next()).toBeInstanceOf(Promise);
  });

  it('generates asynchronously an array containing the file when path is a file', async () => {
    expect(await values(getFilesByDirectory([existingFile]))).toMatchSnapshot();
  });

  it('generates asynchronously an array of files when given path is a directory containing only files', async () => {
    expect(await values(getFilesByDirectory([directoryWithoutSubdirectories]))).toMatchSnapshot();
  });

  it('generates one array per directory when given path is a directory containing sub-directories', async () => {
    expect(await values(getFilesByDirectory([existingDirectory]))).toMatchSnapshot();
  });

  it('omits previously processed files', async () => {
    expect(await values(getFilesByDirectory([existingFile, existingFile]))).toMatchSnapshot();
  });

  it('omits previously processed directories', async () => {
    expect(
      await values(
        getFilesByDirectory([directoryWithoutSubdirectories, directoryWithoutSubdirectories]),
      ),
    ).toMatchSnapshot();
  });

  it('omits previously processed nested directories', async () => {
    expect(
      await values(getFilesByDirectory([existingDirectory, directoryWithoutSubdirectories])),
    ).toMatchSnapshot();

    expect(
      await values(getFilesByDirectory([directoryWithoutSubdirectories, existingDirectory])),
    ).toMatchSnapshot();
  });
});
