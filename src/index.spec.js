import filesByDirectory from './files-by-directory';

const moduleExport = require('.');

describe('module export', () => {
  it('exists', () => {
    expect(moduleExport).toBeDefined();
  });

  it('is a function', () => {
    expect(moduleExport).toBeFunction();
  });

  it('is identical to filesByDirectory', () => {
    expect(moduleExport).toBe(filesByDirectory);
  });
});
