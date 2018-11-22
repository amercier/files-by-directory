import '@babel/polyfill'; // Required for NodeJS < 10
import { values } from './async';
import getFilesByDirectory from './files-by-directory';
import {
  existingFile,
  existingDirectory,
  directoryWithoutSubdirectories,
  level2,
  level2Files,
  level3,
  level3Files,
} from '../fixture';

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

  it('omits double directory paths', async () => {
    expect(await values(getFilesByDirectory([level3, level3]))).toMatchSnapshot();
  });

  it('omits double file paths', async () => {
    expect(await values(getFilesByDirectory([existingFile, existingFile]))).toMatchSnapshot();
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
});
