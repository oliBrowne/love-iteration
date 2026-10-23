import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import { parseReflectionWeek } from './reflection.ts';
import type { Reflection } from './reflection.ts';
import type { RecordMetadata } from './record.ts';

describe('Reflection', () => {
  it('has a weekStart, four optional prompts and record metadata', () => {
    expectTypeOf<Reflection>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<Reflection['weekStart']>().toEqualTypeOf<string>();
    expectTypeOf<Reflection['whatWorked']>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<Reflection['whatWasHard']>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<Reflection['whatToTry']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Reflection['appreciation']>().toEqualTypeOf<
      string | undefined
    >();
  });

  it('allows a record with no prompts answered', () => {
    const demo: Reflection = {
      id: 'demo-reflection-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      weekStart: '2026-01-05',
    };
    expect(demo.weekStart).toBe('2026-01-05');
  });
});

describe('parseReflectionWeek', () => {
  it('accepts a real Monday', () => {
    expect(parseReflectionWeek('2026-01-05')).toBe('2026-01-05');
  });

  it.each([
    '',
    '2026-1-5',
    '2026-02-30',
    '2026-01-06',
    'next week',
    20260105,
    null,
  ])('rejects %j', (value) => {
    expect(() => parseReflectionWeek(value)).toThrow(DomainError);
  });
});
