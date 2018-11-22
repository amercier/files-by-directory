import { ascendanceRegExp, isAscendant, isDescendant, isUniqueAndNotDescendant } from './path';

describe('ascendanceRegExp', () => {
  it('is a RegExp', () => {
    expect(ascendanceRegExp).toBeInstanceOf(RegExp);
  });

  it('matches ascendant paths', () => {
    expect(ascendanceRegExp.test('..')).toBe(true);
    expect(ascendanceRegExp.test('../..')).toBe(true);
  });

  it("doesn't match non-ascendant paths", () => {
    expect(ascendanceRegExp.test('../foo')).toBe(false);
    expect(ascendanceRegExp.test('../../foo')).toBe(false);
    expect(ascendanceRegExp.test('')).toBe(false);
    expect(ascendanceRegExp.test('foo')).toBe(false);
  });
});

describe('isAscendant', () => {
  it('is a function', () => {
    expect(isAscendant).toBeFunction();
  });

  it('returns false when paths are identical', () => {
    expect(isAscendant('/foo/bar', '/foo/bar')).toBe(false);
  });

  it('returns false when subject is a child', () => {
    expect(isAscendant('/foo/bar', '/foo')).toBe(false);
  });

  it('returns false when subject is a grand-child', () => {
    expect(isAscendant('/foo/bar/baz', '/foo')).toBe(false);
  });

  it('returns true when subject is the parent', () => {
    expect(isAscendant('/foo', '/foo/bar')).toBe(true);
  });

  it('returns true when subject is the grand-parent', () => {
    expect(isAscendant('/foo', '/foo/bar/baz')).toBe(true);
  });

  it('returns false when subject is a sibling', () => {
    expect(isAscendant('/foo/bar', '/foo/baz')).toBe(false);
  });

  it('returns false when subject has different root', () => {
    expect(isAscendant('/foo/bar', '/baz/bar')).toBe(false);
  });
});

describe('isDescendant', () => {
  it('is a function', () => {
    expect(isDescendant).toBeFunction();
  });

  it('returns false when paths are identical', () => {
    expect(isDescendant('/foo/bar', '/foo/bar')).toBe(false);
  });

  it('returns true when subject is a child', () => {
    expect(isDescendant('/foo/bar', '/foo')).toBe(true);
  });

  it('returns true when subject is a grand-child', () => {
    expect(isDescendant('/foo/bar/baz', '/foo')).toBe(true);
  });

  it('returns false when subject is the parent', () => {
    expect(isDescendant('/foo', '/foo/bar')).toBe(false);
  });

  it('returns false when subject is the grand-parent', () => {
    expect(isDescendant('/foo', '/foo/bar/baz')).toBe(false);
  });

  it('returns false when subject is a sibling', () => {
    expect(isDescendant('/foo/bar', '/foo/baz')).toBe(false);
  });

  it('returns false when subject has different root', () => {
    expect(isDescendant('/foo/bar', '/baz/bar')).toBe(false);
  });
});

describe('isUniqueAndNotDescendant', () => {
  it('is a function', () => {
    expect(isUniqueAndNotDescendant).toBeFunction();
  });

  it('returns true for the first double', () => {
    expect(isUniqueAndNotDescendant('foo', 0, ['foo', 'bar', 'foo', 'baz'])).toBe(true);
  });

  it('returns false for the second double', () => {
    expect(isUniqueAndNotDescendant('foo', 2, ['foo', 'bar', 'foo', 'baz'])).toBe(false);
  });

  it('returns false for a descendant after an ascendant', () => {
    expect(isUniqueAndNotDescendant('foo/bar', 1, ['foo', 'foo/bar', 'baz'])).toBe(false);
  });

  it('returns false for a descendant before an ascendant', () => {
    expect(isUniqueAndNotDescendant('foo/bar', 0, ['foo/bar', 'foo', 'baz'])).toBe(false);
  });

  it('returns true for an ascendant after an descendant', () => {
    expect(isUniqueAndNotDescendant('foo', 1, ['foo/bar', 'foo', 'baz'])).toBe(true);
  });

  it('returns true for an ascendant before an descendant', () => {
    expect(isUniqueAndNotDescendant('foo', 0, ['foo', 'foo/bar', 'baz'])).toBe(true);
  });

  it('returns true for a unique path', () => {
    expect(isUniqueAndNotDescendant('bar', 1, ['foo', 'bar', 'baz'])).toBe(true);
  });
});
