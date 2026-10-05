import { describe, expect, expectTypeOf, it } from 'vitest';
import type { CheckIn, Mood } from './checkin.ts';
import { moods, parseLocalDate, parseMood } from './checkin.ts';
import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';

describe('CheckIn', () => {
  it('has date, mood, note and record metadata', () => {
    expectTypeOf<CheckIn>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<CheckIn['date']>().toEqualTypeOf<string>();
    expectTypeOf<CheckIn['mood']>().toEqualTypeOf<Mood>();
    expectTypeOf<CheckIn['note']>().toEqualTypeOf<string>();
    const demo: CheckIn = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      date: '2026-01-01',
      mood: 'good',
      note: 'Demo note',
    };
    expect(moods).toContain(demo.mood);
  });
});

describe('parseMood', () => {
  it('accepts every listed mood', () => {
    for (const mood of moods) expect(parseMood(mood)).toBe(mood);
  });

  it('returns a domain error for an unsupported value', () => {
    for (const bad of ['happy', '', 3, null, undefined]) {
      expect(() => parseMood(bad)).toThrow(DomainError);
    }
    try {
      parseMood('happy');
    } catch (error) {
      expect((error as DomainError).code).toBe('invalid-mood');
    }
  });
});

describe('parseLocalDate', () => {
  it('accepts real dates including leap days', () => {
    expect(parseLocalDate('2026-10-05')).toBe('2026-10-05');
    expect(parseLocalDate('2028-02-29')).toBe('2028-02-29');
  });

  it('rejects malformed dates', () => {
    for (const bad of [
      '2026-1-5',
      '2026-02-30',
      '2027-02-29',
      '2026-13-01',
      'today',
      '',
      20261005,
      null,
    ]) {
      expect(() => parseLocalDate(bad)).toThrow(DomainError);
    }
  });
});
