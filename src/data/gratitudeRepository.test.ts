import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { Gratitude } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createGratitudeRepository } from './gratitudeRepository.ts';

const demo: Gratitude = {
  id: 'g-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T09:00:00.000Z',
  updatedAt: '2026-01-01T09:00:00.000Z',
  date: '2026-01-01',
  text: 'Demo: thank you for the voice note.',
};

describe('gratitude repository save', () => {
  it('returns the record after it is saved', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    expect(await repo.get('g-1')).toEqual(demo);
  });

  it('replaces a record saved with the same id', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    await repo.put({ ...demo, text: 'Demo: edited.' });
    expect((await repo.get('g-1'))?.text).toBe('Demo: edited.');
    expect(await repo.list()).toHaveLength(1);
  });
});
