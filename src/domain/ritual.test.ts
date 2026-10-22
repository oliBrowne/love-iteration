import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import {
  dueRituals,
  lastCompletionDate,
  parseRitualCadence,
  parseRitualName,
  ritualCadences,
  ritualStreak,
} from './ritual.ts';
import type { Ritual, RitualCadence, RitualCompletion } from './ritual.ts';
import type { RecordMetadata } from './record.ts';

describe('Ritual', () => {
  it('has name, cadence and record metadata', () => {
    expectTypeOf<Ritual>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<Ritual['name']>().toEqualTypeOf<string>();
    expectTypeOf<Ritual['cadence']>().toEqualTypeOf<RitualCadence>();
    const demo: Ritual = {
      id: 'demo-ritual-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Demo evening call',
      cadence: 'weekly',
    };
    expect(ritualCadences).toContain(demo.cadence);
  });
});

describe('RitualCompletion', () => {
  it('links a ritual to a local date', () => {
    expectTypeOf<RitualCompletion>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<RitualCompletion['ritualId']>().toEqualTypeOf<string>();
    expectTypeOf<RitualCompletion['date']>().toEqualTypeOf<string>();
    const demo: RitualCompletion = {
      id: 'demo-completion-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      ritualId: 'demo-ritual-1',
      date: '2026-01-01',
    };
    expect(demo.date).toBe('2026-01-01');
  });
});

describe('parseRitualName', () => {
  it('returns the trimmed name', () => {
    expect(parseRitualName('  Evening call  ')).toBe('Evening call');
  });

  it.each(['', '   ', '\n\t', null, undefined, 42])(
    'rejects blank or non-text input %j',
    (value) => {
      expect(() => parseRitualName(value)).toThrow(DomainError);
      try {
        parseRitualName(value);
      } catch (error) {
        expect((error as DomainError).code).toBe('blank-ritual-name');
      }
    },
  );
});

describe('parseRitualCadence', () => {
  it.each(['daily', 'weekly'])('accepts %s', (value) => {
    expect(parseRitualCadence(value)).toBe(value);
  });

  it.each(['monthly', 'Daily', '', null, undefined, 7])(
    'rejects %j',
    (value) => {
      expect(() => parseRitualCadence(value)).toThrow(DomainError);
      try {
        parseRitualCadence(value);
      } catch (error) {
        expect((error as DomainError).code).toBe('invalid-ritual-cadence');
      }
    },
  );
});

describe('lastCompletionDate', () => {
  const done = [
    { ritualId: 'a', date: '2026-01-03' },
    { ritualId: 'a', date: '2026-01-09' },
    { ritualId: 'b', date: '2026-02-01' },
  ];

  it('returns the newest date for that ritual only', () => {
    expect(lastCompletionDate(done, 'a')).toBe('2026-01-09');
    expect(lastCompletionDate(done, 'b')).toBe('2026-02-01');
  });

  it('returns undefined when the ritual was never done', () => {
    expect(lastCompletionDate(done, 'c')).toBeUndefined();
    expect(lastCompletionDate([], 'a')).toBeUndefined();
  });
});

describe('dueRituals', () => {
  const base = {
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
  const rituals: Ritual[] = [
    { ...base, id: 'a', name: 'Demo A', cadence: 'daily' },
    { ...base, id: 'b', name: 'Demo B', cadence: 'daily' },
    { ...base, id: 'c', name: 'Demo C', cadence: 'weekly' },
    {
      ...base,
      id: 'd',
      name: 'Demo D',
      cadence: 'daily',
      archivedAt: '2026-01-02T00:00:00.000Z',
    },
  ];
  // Monday 2026-01-05 is the start of this week.
  const wednesday = new Date(2026, 0, 7);
  const ids = (list: Ritual[]) => list.map((r) => r.id);

  it('lists active daily rituals not yet done today', () => {
    const done = [{ ritualId: 'a', date: '2026-01-07' }];
    expect(ids(dueRituals(rituals, done, wednesday))).toEqual(['b', 'c']);
  });

  it('leaves out a paused ritual', () => {
    const paused: Ritual = {
      ...base,
      id: 'e',
      name: 'Demo E',
      cadence: 'daily',
      pausedAt: '2026-01-03T00:00:00.000Z',
    };
    expect(ids(dueRituals([...rituals, paused], [], wednesday))).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('lists a ritual again once its pause is cleared', () => {
    const resumed: Ritual = {
      ...base,
      id: 'e',
      name: 'Demo E',
      cadence: 'daily',
    };
    expect(ids(dueRituals([resumed], [], wednesday))).toEqual(['e']);
  });

  it('ignores daily completions from other days', () => {
    const done = [{ ritualId: 'a', date: '2026-01-06' }];
    expect(ids(dueRituals(rituals, done, wednesday))).toEqual(['a', 'b', 'c']);
  });

  it('lists a weekly ritual until this week is done', () => {
    const done = [{ ritualId: 'c', date: '2026-01-05' }];
    expect(ids(dueRituals(rituals, done, wednesday))).toEqual(['a', 'b']);
    const lastWeek = [{ ritualId: 'c', date: '2025-12-29' }];
    expect(ids(dueRituals(rituals, lastWeek, wednesday))).toContain('c');
  });
});

describe('ritualStreak', () => {
  const daily = { id: 'r1', cadence: 'daily' } as const;
  const weekly = { id: 'r2', cadence: 'weekly' } as const;
  // Thursday 2026-01-15; its week starts Monday 2026-01-12.
  const now = new Date(2026, 0, 15, 12);
  const done = (ritualId: string, dates: string[]) =>
    dates.map((date) => ({ ritualId, date }));

  it('is 0 with no completions', () => {
    expect(ritualStreak([], daily, now)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const items = done('r1', ['2026-01-15', '2026-01-14', '2026-01-13']);
    expect(ritualStreak(items, daily, now)).toBe(3);
  });

  it("keeps yesterday's run when today is not done yet", () => {
    expect(ritualStreak(done('r1', ['2026-01-14']), daily, now)).toBe(1);
  });

  it('stops at a missed day and ignores other rituals', () => {
    const items = [
      ...done('r1', ['2026-01-15', '2026-01-13']),
      ...done('r2', ['2026-01-14']),
    ];
    expect(ritualStreak(items, daily, now)).toBe(1);
  });

  it('is 0 when the last completion is older than yesterday', () => {
    expect(ritualStreak(done('r1', ['2026-01-13']), daily, now)).toBe(0);
  });

  it('counts consecutive weeks across a month boundary', () => {
    const items = done('r2', ['2026-01-12', '2026-01-05', '2025-12-29']);
    expect(ritualStreak(items, weekly, now)).toBe(3);
    expect(ritualStreak(done('r2', ['2026-01-05']), weekly, now)).toBe(1);
  });
});

describe('weekly rollover uses local dates', () => {
  const base = {
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
  const weekly: Ritual = {
    ...base,
    id: 'w',
    name: 'Demo W',
    cadence: 'weekly',
  };
  // Done in the week starting Monday 2026-01-05.
  const done = [{ ritualId: 'w', date: '2026-01-05' }];

  it('is still done at 23:59 on Sunday', () => {
    const sunday = new Date(2026, 0, 11, 23, 59);
    expect(dueRituals([weekly], done, sunday)).toEqual([]);
  });

  it('is due again at 00:00 on Monday', () => {
    const monday = new Date(2026, 0, 12, 0, 0);
    expect(dueRituals([weekly], done, monday)).toEqual([weekly]);
  });

  it('keeps the streak through the new week until it is missed', () => {
    const monday = new Date(2026, 0, 12, 0, 0);
    expect(ritualStreak(done, weekly, monday)).toBe(1);
    const nextMonday = new Date(2026, 0, 19, 0, 0);
    expect(ritualStreak(done, weekly, nextMonday)).toBe(0);
  });

  it('rolls over a month and a year boundary', () => {
    // Monday 2025-12-29 starts the week that contains Thursday 2026-01-01.
    const newYear = new Date(2026, 0, 1, 9, 0);
    const lastWeek = [{ ritualId: 'w', date: '2025-12-29' }];
    expect(dueRituals([weekly], lastWeek, newYear)).toEqual([]);
    expect(ritualStreak(lastWeek, weekly, newYear)).toBe(1);
  });
});
