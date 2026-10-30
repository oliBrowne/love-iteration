// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { createMemoryRepository, openDatabase } from '../../data/index.ts';
import type { ExportData } from '../export/exportData.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';
import { applyImport } from './applyImport.ts';

describe('applyImport', () => {
  it('writes incoming records', async () => {
    const db = await openDatabase(new IDBFactory());
    const memories = createMemoryRepository(db);
    const empty = async () => createMemoryRepository(db);
    const sources = {
      checkIns: empty,
      gratitude: empty,
      memories: async () => memories,
      plans: empty,
      ideas: empty,
      rituals: empty,
      ritualCompletions: empty,
      reflections: empty,
    } as unknown as TimelineSources;
    const record = {
      id: 'm1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Demo memory',
      date: '2026-01-01',
    };
    const data = {
      checkIns: [],
      gratitude: [],
      memories: [record],
      plans: [],
      ideas: [],
      rituals: [],
      ritualCompletions: [],
      reflections: [],
    } as unknown as ExportData;
    await applyImport(data, sources);
    expect(await memories.list()).toHaveLength(1);
    const older = {
      ...record,
      title: 'Older',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };
    const newer = {
      ...record,
      title: 'Newer',
      updatedAt: '2026-06-01T00:00:00.000Z',
    };
    await applyImport(
      { ...data, memories: [older] } as unknown as ExportData,
      sources,
    );
    expect((await memories.get('m1'))?.title).toBe('Demo memory');
    await applyImport(
      { ...data, memories: [newer] } as unknown as ExportData,
      sources,
    );
    expect((await memories.get('m1'))?.title).toBe('Newer');
  });
});
