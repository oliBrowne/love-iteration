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

describe('gratitude repository list', () => {
  it('returns newest entries first', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({
      ...demo,
      id: 'old',
      createdAt: '2026-01-01T09:00:00.000Z',
    });
    await repo.put({
      ...demo,
      id: 'new',
      createdAt: '2026-01-03T09:00:00.000Z',
    });
    await repo.put({
      ...demo,
      id: 'mid',
      createdAt: '2026-01-02T09:00:00.000Z',
    });
    expect((await repo.list()).map((g) => g.id)).toEqual(['new', 'mid', 'old']);
  });

  it('is empty before anything is saved', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    expect(await repo.list()).toEqual([]);
  });
});

describe('gratitude repository delete', () => {
  it('removes only the chosen entry', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    await repo.put({ ...demo, id: 'g-2' });
    await repo.delete('g-1');
    expect(await repo.get('g-1')).toBeUndefined();
    expect((await repo.list()).map((g) => g.id)).toEqual(['g-2']);
  });

  it('ignores an unknown id', async () => {
    const repo = createGratitudeRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    await repo.delete('missing');
    expect(await repo.list()).toHaveLength(1);
  });
});
