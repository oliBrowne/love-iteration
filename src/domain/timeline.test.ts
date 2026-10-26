import { describe, expect, it } from 'vitest';
import { timelineKinds } from './timeline.ts';
import type { TimelineEntry, TimelineKind } from './timeline.ts';

// One label per kind. Adding a kind to the type without a label here fails
// the typecheck, so the list below cannot fall behind.
const labels: Record<TimelineKind, string> = {
  checkin: 'Check-in',
  gratitude: 'Gratitude',
  memory: 'Memory',
  plan: 'Plan',
  'ritual-completion': 'Ritual',
  reflection: 'Reflection',
};

describe('timeline entry shape', () => {
  it('names every dated local record kind exactly once', () => {
    expect([...timelineKinds].sort()).toEqual(Object.keys(labels).sort());
    expect(new Set(timelineKinds).size).toBe(timelineKinds.length);
  });

  it('describes an entry with the fields every kind shares', () => {
    const entry: TimelineEntry = {
      id: 'demo-1',
      kind: 'gratitude',
      date: '2026-01-05',
      summary: 'Demo: a kind message',
      createdAt: '2026-01-05T09:00:00.000Z',
    };
    expect(Object.keys(entry).sort()).toEqual([
      'createdAt',
      'date',
      'id',
      'kind',
      'summary',
    ]);
  });
});
