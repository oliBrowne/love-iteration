import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import {
  createCheckInRepository,
  createGratitudeRepository,
  createIdeaRepository,
  createMemoryRepository,
  createPlanRepository,
  createReflectionRepository,
  createRitualCompletionRepository,
  createRitualRepository,
  openDatabase,
} from '../../data/index.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';
import { deleteAllData, deleteKind } from './deleteAllData.ts';

describe('deleteAllData', () => {
  it('leaves every domain store empty', async () => {
    const db = await openDatabase(new IDBFactory());
    const sources: TimelineSources = {
      checkIns: async () => createCheckInRepository(db),
      gratitude: async () => createGratitudeRepository(db),
      memories: async () => createMemoryRepository(db),
      plans: async () => createPlanRepository(db),
      ideas: async () => createIdeaRepository(db),
      rituals: async () => createRitualRepository(db),
      ritualCompletions: async () => createRitualCompletionRepository(db),
      reflections: async () => createReflectionRepository(db),
    };
    const names = Object.keys(sources) as (keyof TimelineSources)[];
    // Demo records: the repositories only need an ID and timestamps.
    const demo = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
    };
    for (const name of names) {
      const repository = await sources[name]();
      await (repository.put as (record: unknown) => Promise<void>)(demo);
      expect(await repository.list()).toHaveLength(1);
    }

    await deleteAllData(sources);

    for (const name of names) {
      expect(await (await sources[name]()).list()).toEqual([]);
    }
  });
});

describe('deleteKind', () => {
  it('clears only the selected kind', async () => {
    const db = await openDatabase(new IDBFactory());
    const sources = {
      checkIns: async () => createCheckInRepository(db),
      gratitude: async () => createGratitudeRepository(db),
    } as unknown as TimelineSources;
    const demo = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-01T10:00:00.000Z',
    };
    for (const name of ['checkIns', 'gratitude'] as const) {
      const repository = await sources[name]();
      await (repository.put as (record: unknown) => Promise<void>)(demo);
    }

    await deleteKind('gratitude', sources);

    expect(await (await sources.gratitude()).list()).toEqual([]);
    expect(await (await sources.checkIns()).list()).toHaveLength(1);
  });
});
