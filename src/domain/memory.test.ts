import { describe, expect, expectTypeOf, it } from 'vitest';
import type { Memory } from './memory.ts';
import type { RecordMetadata } from './record.ts';

describe('Memory', () => {
  it('has title, date, note and record metadata', () => {
    expectTypeOf<Memory>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<Memory['title']>().toEqualTypeOf<string>();
    expectTypeOf<Memory['date']>().toEqualTypeOf<string>();
    expectTypeOf<Memory['note']>().toEqualTypeOf<string>();
    const demo: Memory = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Demo: the first video call',
      date: '2026-01-01',
      note: '',
    };
    expect(demo.title).toContain('Demo');
  });
});
