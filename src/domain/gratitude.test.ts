import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import type { Gratitude } from './gratitude.ts';
import { parseGratitudeText } from './gratitude.ts';
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
});
