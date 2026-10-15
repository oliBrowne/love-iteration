import { describe, expect, expectTypeOf, it } from 'vitest';
import type { DateIdea, DateIdeaState } from './dateIdea.ts';
import type { RecordMetadata } from './record.ts';

describe('DateIdea', () => {
  it('has title, note, state and record metadata', () => {
    expectTypeOf<DateIdea>().toMatchTypeOf<RecordMetadata>();
    expectTypeOf<DateIdea['title']>().toEqualTypeOf<string>();
    expectTypeOf<DateIdea['note']>().toEqualTypeOf<string>();
    expectTypeOf<DateIdea['state']>().toEqualTypeOf<DateIdeaState>();
    const demo: DateIdea = {
      id: 'demo-1',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Demo: watch the same film together',
      note: '',
      state: 'active',
    };
    expect(demo.state).toBe('active');
  });
});
