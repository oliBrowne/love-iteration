import { describe, expect, it } from 'vitest';
import type { CheckIn } from './checkin.ts';
import type { Gratitude } from './gratitude.ts';
import type { Memory } from './memory.ts';
import type { PlannedDate } from './plannedDate.ts';
import type { Reflection } from './reflection.ts';
import type { RitualCompletion } from './ritual.ts';
import {
  SUMMARY_MAX_LENGTH,
  checkInToTimelineEntry,
  gratitudeToTimelineEntry,
  memoryToTimelineEntry,
  planToTimelineEntry,
  reflectionToTimelineEntry,
  ritualCompletionToTimelineEntry,
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

describe('gratitudeToTimelineEntry', () => {
  const gratitude: Gratitude = {
    id: 'demo-gratitude',
    schemaVersion: 1,
    createdAt: '2026-01-06T20:00:00.000Z',
    updatedAt: '2026-01-06T20:00:00.000Z',
    date: '2026-01-06',
    text: 'Demo: a kind message',
  };

  it('keeps the source id, day, and creation time', () => {
    expect(gratitudeToTimelineEntry(gratitude)).toEqual({
      id: 'demo-gratitude',
      kind: 'gratitude',
      date: '2026-01-06',
      summary: 'Demo: a kind message',
      createdAt: '2026-01-06T20:00:00.000Z',
    });
  });

  it('cuts a long text to one short line', () => {
    const { summary } = gratitudeToTimelineEntry({
      ...gratitude,
      text: 'y'.repeat(300),
    });
    expect(summary).toHaveLength(SUMMARY_MAX_LENGTH);
    expect(summary.endsWith('…')).toBe(true);
  });
});

describe('memoryToTimelineEntry', () => {
  const memory: Memory = {
    id: 'demo-memory',
    schemaVersion: 1,
    createdAt: '2026-01-07T10:00:00.000Z',
    updatedAt: '2026-01-07T10:00:00.000Z',
    title: 'Demo: first video call',
    date: '2025-12-20',
    note: 'We talked until the battery died',
  };

  it('uses the memory day, not the day it was saved', () => {
    const entry = memoryToTimelineEntry(memory);
    expect(entry.date).toBe('2025-12-20');
    expect(entry.createdAt).toBe('2026-01-07T10:00:00.000Z');
    expect(entry.id).toBe('demo-memory');
    expect(entry.kind).toBe('memory');
  });

  it('summarizes the title and the note', () => {
    expect(memoryToTimelineEntry(memory).summary).toBe(
      'Demo: first video call: We talked until the battery died',
    );
  });

  it('shows only the title when there is no note', () => {
    expect(memoryToTimelineEntry({ ...memory, note: '' }).summary).toBe(
      'Demo: first video call',
    );
  });

  it('keeps the summary to one short line', () => {
    const { summary } = memoryToTimelineEntry({
      ...memory,
      note: 'z'.repeat(300),
    });
    expect(summary).toHaveLength(SUMMARY_MAX_LENGTH);
  });
});

describe('planToTimelineEntry', () => {
  const startsAt = new Date(2026, 1, 14, 18, 30).toISOString();
  const plan: PlannedDate = {
    id: 'demo-plan',
    schemaVersion: 1,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
    ideaId: 'demo-idea',
    startsAt,
    status: 'planned',
  };

  it('lands on the local day the plan starts', () => {
    const entry = planToTimelineEntry(plan, 'Demo: movie night');
    expect(entry.date).toBe('2026-02-14');
    expect(entry.id).toBe('demo-plan');
    expect(entry.kind).toBe('plan');
    expect(entry.createdAt).toBe('2026-02-01T10:00:00.000Z');
  });

  it('puts the status and idea title in the summary', () => {
    expect(planToTimelineEntry(plan, 'Demo: movie night').summary).toBe(
      'Planned: Demo: movie night',
    );
    expect(
      planToTimelineEntry({ ...plan, status: 'done' }, 'Demo: movie night')
        .summary,
    ).toBe('Enjoyed: Demo: movie night');
    expect(
      planToTimelineEntry({ ...plan, status: 'cancelled' }, 'Demo: movie night')
        .summary,
    ).toBe('Cancelled: Demo: movie night');
  });
});

describe('ritualCompletionToTimelineEntry', () => {
  const completion: RitualCompletion = {
    id: 'demo-completion',
    schemaVersion: 1,
    createdAt: '2026-01-08T21:00:00.000Z',
    updatedAt: '2026-01-08T21:00:00.000Z',
    ritualId: 'demo-ritual',
    date: '2026-01-08',
  };

  it('keeps the source id, day, and creation time', () => {
    const entry = ritualCompletionToTimelineEntry(completion, 'Demo: tea');
    expect(entry).toMatchObject({
      id: 'demo-completion',
      kind: 'ritual-completion',
      date: '2026-01-08',
      createdAt: '2026-01-08T21:00:00.000Z',
    });
  });

  it('names the ritual in the summary', () => {
    expect(
      ritualCompletionToTimelineEntry(completion, 'Demo: Sunday call').summary,
    ).toBe('Ritual: Demo: Sunday call');
  });
});

describe('reflectionToTimelineEntry', () => {
  const reflection: Reflection = {
    id: 'demo-reflection',
    schemaVersion: 1,
    createdAt: '2026-01-11T20:00:00.000Z',
    updatedAt: '2026-01-11T20:00:00.000Z',
    weekStart: '2026-01-05',
    whatWasHard: 'Demo: a busy Tuesday',
    appreciation: 'Demo: a kind note',
  };

  it('sits on the Monday that starts the week', () => {
    const entry = reflectionToTimelineEntry(reflection);
    expect(entry.date).toBe('2026-01-05');
    expect(entry.id).toBe('demo-reflection');
    expect(entry.kind).toBe('reflection');
    expect(entry.createdAt).toBe('2026-01-11T20:00:00.000Z');
  });

  it('summarizes the first prompt that was answered', () => {
    expect(reflectionToTimelineEntry(reflection).summary).toBe(
      'Weekly reflection: Demo: a busy Tuesday',
    );
  });

  it('still reads well when no prompt was answered', () => {
    const empty: Reflection = { ...reflection };
    delete empty.whatWasHard;
    delete empty.appreciation;
    expect(reflectionToTimelineEntry(empty).summary).toBe('Weekly reflection');
  });
});
