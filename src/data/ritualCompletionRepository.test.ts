import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { RitualCompletion } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createRitualCompletionRepository } from './ritualCompletionRepository.ts';

const demo: RitualCompletion = {
  id: 'c-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T09:00:00.000Z',
  updatedAt: '2026-01-01T09:00:00.000Z',
  ritualId: 'r-1',
  date: '2026-01-01',
};

describe('ritual completion repository', () => {
  it('saves a completion and lists newest date first', async () => {
    const repo = createRitualCompletionRepository(
      await openDatabase(new IDBFactory()),
    );
    await repo.put(demo);
    await repo.put({ ...demo, id: 'c-2', date: '2026-01-02' });
    expect(await repo.get('c-1')).toEqual(demo);
    expect((await repo.list()).map((c) => c.date)).toEqual([
      '2026-01-02',
      '2026-01-01',
    ]);
  });
});
