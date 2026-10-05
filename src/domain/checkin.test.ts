import { describe, expect, expectTypeOf, it } from 'vitest';
import type { CheckIn, Mood } from './checkin.ts';
import { moods } from './checkin.ts';
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
