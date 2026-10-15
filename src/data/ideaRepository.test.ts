import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import type { DateIdea } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createIdeaRepository } from './ideaRepository.ts';

const demo: DateIdea = {
  id: 'i-1',
  schemaVersion: 1,
  createdAt: '2026-01-01T09:00:00.000Z',
  updatedAt: '2026-01-01T09:00:00.000Z',
  title: 'Demo: watch the same film together',
  note: 'Demo note.',
  state: 'active',
};

describe('idea repository save', () => {
  it('returns the idea after it is saved', async () => {
    const repo = createIdeaRepository(await openDatabase(new IDBFactory()));
    await repo.put(demo);
    expect(await repo.get('i-1')).toEqual(demo);
  });

  it('replaces an idea saved with the same id', async () => {
    const repo = createIdeaRepository(await openDatabase(new IDBFactory()));
    await repo.put(demo);
    await repo.put({ ...demo, state: 'completed' });
    expect((await repo.get('i-1'))?.state).toBe('completed');
    expect(await repo.list()).toHaveLength(1);
  });
});

describe('idea repository list', () => {
  it('sorts active ideas above completed ones', async () => {
    const repo = createIdeaRepository(await openDatabase(new IDBFactory()));
    await repo.put({
      ...demo,
      id: 'done-new',
      state: 'completed',
      createdAt: '2026-03-01T00:00:00.000Z',
    });
    await repo.put({
      ...demo,
      id: 'active-old',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    await repo.put({
      ...demo,
      id: 'active-new',
      createdAt: '2026-02-01T00:00:00.000Z',
    });
    await repo.put({
      ...demo,
      id: 'done-old',
      state: 'completed',
      createdAt: '2026-01-15T00:00:00.000Z',
    });
    expect((await repo.list()).map((i) => i.id)).toEqual([
      'active-new',
      'active-old',
      'done-new',
      'done-old',
    ]);
  });

  it('returns an empty list when nothing is saved', async () => {
    const repo = createIdeaRepository(await openDatabase(new IDBFactory()));
    expect(await repo.list()).toEqual([]);
  });
});
