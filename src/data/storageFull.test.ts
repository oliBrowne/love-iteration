import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import {
  explainStorageError,
  StorageFullError,
  storageFullMessage,
} from './storageFull.ts';

describe('explainStorageError', () => {
  it('turns a quota failure into advice to export first', () => {
    const quota = new DOMException('full', 'QuotaExceededError');
    const result = explainStorageError(quota);
    expect(result).toBeInstanceOf(StorageFullError);
    expect((result as Error).message).toBe(storageFullMessage);
    expect(storageFullMessage).toContain('Download export');
  });

  it('leaves other errors alone', () => {
    const other = new Error('nope');
    expect(explainStorageError(other)).toBe(other);
  });
});
