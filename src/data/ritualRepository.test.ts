import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { Ritual } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createRitualRepository } from './ritualRepository.ts';

const demo: Ritual = {
  id: 'r-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T09:00:00.000Z',
  updatedAt: '2026-01-01T09:00:00.000Z',
  name: 'Demo evening call',
  cadence: 'daily',
};

describe('ritual repository save', () => {
  it('returns the ritual after it is saved', async () => {
    const repo = createRitualRepository(await openDatabase(new IDBFactory()));
    await repo.put(demo);
    expect(await repo.get('r-1')).toEqual(demo);
  });

  it('replaces a ritual saved with the same id', async () => {
    const repo = createRitualRepository(await openDatabase(new IDBFactory()));
    await repo.put(demo);
    await repo.put({ ...demo, cadence: 'weekly' });
    expect((await repo.get('r-1'))?.cadence).toBe('weekly');
    expect(await repo.list()).toHaveLength(1);
  });
});

describe('ritual repository list', () => {
  it('returns rituals in name order', async () => {
    const repo = createRitualRepository(await openDatabase(new IDBFactory()));
    await repo.put({ ...demo, id: 'r-b', name: 'Demo breakfast message' });
    await repo.put({ ...demo, id: 'r-c', name: 'Demo weekend film' });
    await repo.put({ ...demo, id: 'r-a', name: 'Demo anniversary letter' });
    expect((await repo.list()).map((ritual) => ritual.name)).toEqual([
      'Demo anniversary letter',
      'Demo breakfast message',
      'Demo weekend film',
    ]);
  });

  it('returns an empty list when nothing is saved', async () => {
    const repo = createRitualRepository(await openDatabase(new IDBFactory()));
    expect(await repo.list()).toEqual([]);
  });
});
