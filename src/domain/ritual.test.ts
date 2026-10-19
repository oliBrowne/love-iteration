import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import {
  parseRitualCadence,
  parseRitualName,
  ritualCadences,
} from './ritual.ts';
import type { Ritual, RitualCadence } from './ritual.ts';
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
