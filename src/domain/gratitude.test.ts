import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import type { Gratitude } from './gratitude.ts';
import {
  GRATITUDE_MAX_LENGTH,
  countGratitudeThisWeek,
  filterGratitudeByMonth,
  formatMonthLabel,
  gratitudeMonths,
  parseGratitudeText,
} from './gratitude.ts';
import type { RecordMetadata } from './record.ts';

describe('Gratitude', () => {
  it('has text, date and record metadata', () => {
    expectTypeOf<Gratitude>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<Gratitude['text']>().toEqualTypeOf<string>();
    expectTypeOf<Gratitude['date']>().toEqualTypeOf<string>();
    const demo: Gratitude = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      date: '2026-01-01',
      text: 'Demo: thank you for the voice note.',
    };
    expectTypeOf(demo).toEqualTypeOf<Gratitude>();
  });
});

describe('parseGratitudeText', () => {
  it('rejects blank text', () => {
    for (const blank of ['', '   ', '\n\t', undefined, 3]) {
      expect(() => parseGratitudeText(blank)).toThrow(DomainError);
    }
  });

  it('returns trimmed text', () => {
    expect(parseGratitudeText('  Demo thanks  ')).toBe('Demo thanks');
  });

  it('blocks oversized text but allows exactly the limit', () => {
    const atLimit = 'a'.repeat(GRATITUDE_MAX_LENGTH);
    expect(parseGratitudeText(atLimit)).toBe(atLimit);
    expect(() => parseGratitudeText(atLimit + 'a')).toThrow(DomainError);
  });
});

describe('countGratitudeThisWeek', () => {
  // Wednesday 2026-03-04; its week runs Mon 2026-03-02 to Sun 2026-03-08.
  const now = new Date(2026, 2, 4, 12);
  const days = (list: string[]) => list.map((date) => ({ date }));

  it('counts only entries from the current Monday-to-Sunday week', () => {
    const entries = days([
      '2026-03-01', // Sunday before
      '2026-03-02',
      '2026-03-04',
      '2026-03-08',
      '2026-03-09', // Monday after
    ]);
    expect(countGratitudeThisWeek(entries, now)).toBe(3);
  });

  it('treats Sunday as the end of the week', () => {
    const sunday = new Date(2026, 2, 8, 20);
    expect(
      countGratitudeThisWeek(days(['2026-03-02', '2026-03-08']), sunday),
    ).toBe(2);
  });

  it('is zero with no entries', () => {
    expect(countGratitudeThisWeek([], now)).toBe(0);
  });
});

describe('gratitude month filter', () => {
  const entries = [
    { date: '2026-03-02' },
    { date: '2026-03-20' },
    { date: '2026-01-15' },
  ];

  it('lists distinct months newest first', () => {
    expect(gratitudeMonths(entries)).toEqual(['2026-03', '2026-01']);
  });

  it('limits entries to the selected month, or keeps all when empty', () => {
    expect(filterGratitudeByMonth(entries, '2026-03')).toHaveLength(2);
    expect(filterGratitudeByMonth(entries, '2026-01')).toHaveLength(1);
    expect(filterGratitudeByMonth(entries, '')).toHaveLength(3);
  });

  it('labels a month readably', () => {
    expect(formatMonthLabel('2026-03', 'en-US')).toBe('March 2026');
  });
});
