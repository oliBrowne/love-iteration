import { describe, expect, expectTypeOf, it } from 'vitest';
import type { CheckIn, Mood } from './checkin.ts';
import { moods, parseMood } from './checkin.ts';
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
