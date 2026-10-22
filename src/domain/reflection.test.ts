import { describe, expect, expectTypeOf, it } from 'vitest';
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
