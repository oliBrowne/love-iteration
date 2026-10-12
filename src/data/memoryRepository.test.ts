import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { Memory } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createMemoryRepository } from './memoryRepository.ts';

const demo: Memory = {
  id: 'm-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T09:00:00.000Z',
  updatedAt: '2026-01-01T09:00:00.000Z',
  title: 'Demo: the first video call',
  date: '2026-01-01',
  note: 'Demo note.',
};

describe('memory repository save', () => {
  it('returns the memory after it is saved', async () => {
    const repo = createMemoryRepository(await openDatabase(new IDBFactory()));
    await repo.put(demo);
    expect(await repo.get('m-1')).toEqual(demo);
  });

  it('replaces a memory saved with the same id', async () => {
    const repo = createMemoryRepository(await openDatabase(new IDBFactory()));
    await repo.put(demo);
    await repo.put({ ...demo, title: 'Demo: edited' });
    expect((await repo.get('m-1'))?.title).toBe('Demo: edited');
    expect(await repo.list()).toHaveLength(1);
  });

  it('keeps memories separate from other stores', async () => {
    const db = await openDatabase(new IDBFactory());
    await createMemoryRepository(db).put(demo);
    expect(
      await new Promise((resolve) => {
        const req = db
          .transaction('gratitude')
          .objectStore('gratitude')
          .count();
        req.onsuccess = () => resolve(req.result);
      }),
    ).toBe(0);
  });
});

describe('memory repository list', () => {
  it('sorts memories by date, newest first', async () => {
    const repo = createMemoryRepository(await openDatabase(new IDBFactory()));
    await repo.put({ ...demo, id: 'mid', date: '2026-02-01' });
    await repo.put({ ...demo, id: 'old', date: '2025-12-25' });
    await repo.put({ ...demo, id: 'new', date: '2026-03-10' });
    expect((await repo.list()).map((m) => m.id)).toEqual(['new', 'mid', 'old']);
  });

  it('orders same-day memories by when they were written', async () => {
    const repo = createMemoryRepository(await openDatabase(new IDBFactory()));
    await repo.put({
      ...demo,
      id: 'first',
      createdAt: '2026-01-01T08:00:00.000Z',
    });
    await repo.put({
      ...demo,
      id: 'second',
      createdAt: '2026-01-01T20:00:00.000Z',
    });
    expect((await repo.list()).map((m) => m.id)).toEqual(['second', 'first']);
  });

  it('returns an empty list when nothing is saved', async () => {
    const repo = createMemoryRepository(await openDatabase(new IDBFactory()));
    expect(await repo.list()).toEqual([]);
  });
});
