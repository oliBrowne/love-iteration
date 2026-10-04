import { describe, expect, it } from 'vitest';
import { generateId, isValidId } from './id.ts';

describe('generateId', () => {
  it('creates valid, distinct IDs', () => {
    const ids = Array.from({ length: 100 }, () => generateId());
    expect(ids.every(isValidId)).toBe(true);
    expect(new Set(ids).size).toBe(100);
  });

  it('rejects malformed IDs', () => {
    expect(isValidId('not-an-id')).toBe(false);
    expect(isValidId('')).toBe(false);
  });
});
