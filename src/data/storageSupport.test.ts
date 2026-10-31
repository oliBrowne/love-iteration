import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { storageSupported } from './storageSupport.ts';

describe('storageSupported', () => {
  it('is true when a database factory exists', () => {
    expect(storageSupported(new IDBFactory())).toBe(true);
  });

  it('is false when the browser has no database', () => {
    expect(storageSupported(undefined)).toBe(false);
  });
});
