import { describe, expect, it } from 'vitest';
import type { CheckIn } from './checkin.ts';
import {
  SUMMARY_MAX_LENGTH,
  checkInToTimelineEntry,
  timelineKinds,
} from './timeline.ts';
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

describe('checkInToTimelineEntry', () => {
  const checkIn: CheckIn = {
    id: 'demo-checkin',
    schemaVersion: 1,
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
    date: '2026-01-05',
    mood: 'good',
    note: 'Demo: a quiet morning',
  };

  it('keeps the source id, day, and creation time', () => {
    const entry = checkInToTimelineEntry(checkIn);
    expect(entry).toMatchObject({
      id: 'demo-checkin',
      kind: 'checkin',
      date: '2026-01-05',
      createdAt: '2026-01-05T09:00:00.000Z',
    });
  });

  it('summarizes the mood and the note', () => {
    expect(checkInToTimelineEntry(checkIn).summary).toBe(
      'Feeling good: Demo: a quiet morning',
    );
  });

  it('shows only the mood when the note is blank', () => {
    expect(checkInToTimelineEntry({ ...checkIn, note: '  ' }).summary).toBe(
      'Feeling good',
    );
  });

  it('puts a long multi-line note on one short line', () => {
    const note = `first line\n${'x'.repeat(300)}`;
    const { summary } = checkInToTimelineEntry({ ...checkIn, note });
    expect(summary).not.toContain('\n');
    expect(summary.endsWith('…')).toBe(true);
    expect(summary.length).toBeLessThanOrEqual(
      'Feeling good: '.length + SUMMARY_MAX_LENGTH,
    );
  });
});
