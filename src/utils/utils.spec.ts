import { describe, expect, it } from 'vitest';

import { trimSpaces } from '.';

describe('trimSpaces', () => {
  it('should trim leading and trailing spaces', () => {
    expect(trimSpaces('  test  ')).toBe('test');
  });

  it('should replace multiple spaces with a single space', () => {
    expect(trimSpaces('test   test')).toBe('test test');
  });
});
