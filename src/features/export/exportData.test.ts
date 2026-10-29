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
import { buildExport, serializeExport } from './exportData.ts';

async function makeSources(): Promise<TimelineSources> {
  const db = await openDatabase(new IDBFactory());
  return {
    checkIns: async () => createCheckInRepository(db),
    gratitude: async () => createGratitudeRepository(db),
    memories: async () => createMemoryRepository(db),
    plans: async () => createPlanRepository(db),
    ideas: async () => createIdeaRepository(db),
    rituals: async () => createRitualRepository(db),
    ritualCompletions: async () => createRitualCompletionRepository(db),
    reflections: async () => createReflectionRepository(db),
  };
}

const stamp = '2026-01-01T10:00:00.000Z';
const meta = { schemaVersion: 1, createdAt: stamp, updatedAt: stamp };
const now = new Date('2026-02-03T04:05:06.000Z');

describe('buildExport', () => {
  it('lists every record kind, empty when nothing is saved', async () => {
    const { data, schemaVersion, exportedAt } = await buildExport(
      await makeSources(),
      now,
    );
    expect(schemaVersion).toBe(1);
    expect(exportedAt).toBe(now.toISOString());
    expect(Object.keys(data).sort()).toEqual([
      'checkIns',
      'gratitude',
      'ideas',
      'memories',
      'plans',
      'reflections',
      'ritualCompletions',
      'rituals',
    ]);
    for (const list of Object.values(data)) expect(list).toEqual([]);
  });

  it('includes saved records of the timeline kinds', async () => {
    const sources = await makeSources();
    await (
      await sources.gratitude()
    ).put({ ...meta, id: 'g1', text: 'Demo thanks', date: '2026-01-01' });
    await (
      await sources.memories()
    ).put({
      ...meta,
      id: 'm1',
      title: 'Demo memory',
      note: '',
      date: '2026-01-01',
    });
    const { data } = await buildExport(sources, now);
    expect(data.gratitude.map((g) => g.id)).toEqual(['g1']);
    expect(data.memories.map((m) => m.id)).toEqual(['m1']);
  });
});

describe('serializeExport', () => {
  it('produces JSON that parses back to the envelope', async () => {
    const text = await serializeExport(await makeSources(), now);
    const parsed = JSON.parse(text);
    expect(parsed.app).toBe('love-iteration');
    expect(parsed.exportedAt).toBe(now.toISOString());
    expect(parsed.data.checkIns).toEqual([]);
  });
});
