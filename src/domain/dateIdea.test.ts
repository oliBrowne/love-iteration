import { describe, expect, expectTypeOf, it } from 'vitest';
import { DomainError } from './errors.ts';
import {
  dateIdeaCategories,
  countIdeas,
  filterIdeasByCategory,
  searchIdeas,
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

describe('searchIdeas', () => {
  const make = (title: string, note: string): DateIdea => ({
    id: title,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    title,
    note,
    state: 'active',
  });
  const ideas = [make('Picnic', 'bring a blanket'), make('Film', 'popcorn')];

  it('matches title or note, ignoring case', () => {
    expect(searchIdeas(ideas, 'PICN').map((i) => i.id)).toEqual(['Picnic']);
    expect(searchIdeas(ideas, 'Popcorn').map((i) => i.id)).toEqual(['Film']);
  });

  it('keeps everything for blank text and nothing for no match', () => {
    expect(searchIdeas(ideas, '  ')).toEqual(ideas);
    expect(searchIdeas(ideas, 'zzz')).toEqual([]);
  });
});

describe('countIdeas', () => {
  it('counts active and completed ideas', () => {
    const make = (state: DateIdea['state']): DateIdea => ({
      id: Math.random().toString(),
      schemaVersion: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Demo',
      note: '',
      state,
    });
    expect(
      countIdeas([make('active'), make('completed'), make('active')]),
    ).toEqual({ active: 2, completed: 1 });
    expect(countIdeas([])).toEqual({ active: 0, completed: 0 });
  });
});
