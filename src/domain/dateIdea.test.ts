import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import {
  dateIdeaCategories,
  filterIdeasByCategory,
  parseDateIdeaTitle,
} from './dateIdea.ts';
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

describe('DateIdea category', () => {
  it('offers a fixed list and is optional on old records', () => {
    expect(dateIdeaCategories).toContain('other');
    const old: DateIdea = {
      id: 'demo-2',
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Demo',
      note: '',
      state: 'active',
    };
    expect(old.category).toBeUndefined();
  });
});

describe('parseDateIdeaTitle', () => {
  it('returns the trimmed title', () => {
    expect(parseDateIdeaTitle('  Picnic  ')).toBe('Picnic');
  });

  it.each(['', '   ', '\n\t', null, undefined, 42])(
    'rejects blank or non-text input %j',
    (value) => {
      expect(() => parseDateIdeaTitle(value)).toThrow(DomainError);
      try {
        parseDateIdeaTitle(value);
      } catch (error) {
        expect((error as DomainError).code).toBe('blank-idea-title');
      }
    },
  );
});

describe('filterIdeasByCategory', () => {
  const make = (id: string, category?: DateIdea['category']): DateIdea => ({
    id,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    title: id,
    note: '',
    state: 'active',
    category,
  });

  it('keeps only the chosen category', () => {
    const ideas = [make('a', 'trip'), make('b', 'outing'), make('c')];
    expect(filterIdeasByCategory(ideas, 'trip').map((i) => i.id)).toEqual([
      'a',
    ]);
  });

  it('keeps everything for an empty filter', () => {
    const ideas = [make('a', 'trip'), make('c')];
    expect(filterIdeasByCategory(ideas, '')).toEqual(ideas);
  });
});
