import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { Reflection } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createReflectionRepository } from './reflectionRepository.ts';

const demo: Reflection = {
  id: 'w-1',
  schemaVersion: 1,
  createdAt: '2026-01-11T18:00:00.000Z',
  updatedAt: '2026-01-11T18:00:00.000Z',
  weekStart: '2026-01-05',
  whatWorked: 'Demo: a long call on Sunday',
  appreciation: 'Demo: thanks for the voice note',
};

describe('reflection repository save', () => {
  it('returns the reflection after it is saved', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    expect(await repo.get('w-1')).toEqual(demo);
  });

  it('replaces a reflection saved with the same id', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    await repo.put({ ...demo, whatToTry: 'Demo: a shared playlist' });
    expect((await repo.get('w-1'))?.whatToTry).toBe('Demo: a shared playlist');
    expect(await repo.list()).toHaveLength(1);
  });
});

describe('reflection repository list', () => {
  it('returns the newest week first', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put({ ...demo, id: 'w-b', weekStart: '2026-01-12' });
    await repo.put({ ...demo, id: 'w-c', weekStart: '2026-01-19' });
    await repo.put({ ...demo, id: 'w-a', weekStart: '2026-01-05' });
    expect((await repo.list()).map((item) => item.weekStart)).toEqual([
      '2026-01-19',
      '2026-01-12',
      '2026-01-05',
    ]);
  });

  it('returns an empty list when nothing is saved', async () => {
    const repo = createReflectionRepository(
      await openDatabase(new IDBFactory()),
    );
    expect(await repo.list()).toEqual([]);
  });
});
