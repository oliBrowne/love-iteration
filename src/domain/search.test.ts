// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  groupSearchResults,
  isSearchShortcut,
  normalizeSearchText,
  searchEntries,
  searchTextForEntry,
} from './search.ts';
import type { TimelineEntry } from './timeline.ts';

describe('normalizeSearchText', () => {
  it('lower-cases, strips accents, and collapses whitespace', () => {
    expect(normalizeSearchText('  Café \n  AU   Lait ')).toBe('cafe au lait');
  });

  it('returns an empty string for blank text', () => {
    expect(normalizeSearchText(' \t\n ')).toBe('');
  });
});

describe('searchTextForEntry', () => {
  it('combines the kind label and the summary in normalized form', () => {
    const entry: TimelineEntry = {
      id: 'demo-1',
      kind: 'gratitude',
      date: '2026-01-05',
      summary: 'Demo:  A Kind   Message',
      createdAt: '2026-01-05T09:00:00.000Z',
    };
    expect(searchTextForEntry(entry)).toBe('gratitude demo: a kind message');
  });
});

describe('searchEntries', () => {
  const entry = (id: string, summary: string): TimelineEntry => ({
    id,
    kind: 'memory',
    date: '2026-01-05',
    summary,
    createdAt: '2026-01-05T09:00:00.000Z',
  });
  const entries = [entry('a', 'Demo: sunny walk'), entry('b', 'Demo: tea')];

  it('matches entries containing every word, in any order', () => {
    expect(searchEntries(entries, 'WALK  sunny')).toEqual([entries[0]]);
  });

  it('gives the same matches whatever the case or whitespace of the query', () => {
    const expected = [entries[0]];
    for (const query of ['sunny walk', 'SUNNY WALK', '  sunny\t\nwalk  ']) {
      expect(searchEntries(entries, query)).toEqual(expected);
    }
  });

  it('matches regardless of case, accents, and spacing in the entry text', () => {
    const messy = [entry('c', 'Demo:  CAFÉ\n  au   lait')];
    expect(searchEntries(messy, 'cafe AU lait')).toEqual(messy);
    expect(searchEntries(messy, 'café')).toEqual(messy);
  });

  it('matches nothing for a blank query', () => {
    expect(searchEntries(entries, '   ')).toEqual([]);
  });
});

describe('groupSearchResults', () => {
  const entry = (id: string, kind: TimelineEntry['kind']): TimelineEntry => ({
    id,
    kind,
    date: '2026-01-05',
    summary: id,
    createdAt: '2026-01-05T09:00:00.000Z',
  });

  it('groups by kind in timeline kind order and skips empty kinds', () => {
    const groups = groupSearchResults([
      entry('m1', 'memory'),
      entry('g1', 'gratitude'),
      entry('m2', 'memory'),
    ]);
    expect(groups.map((g) => g.kind)).toEqual(['gratitude', 'memory']);
    expect(groups[1]?.entries.map((e) => e.id)).toEqual(['m1', 'm2']);
  });
});

describe('isSearchShortcut', () => {
  const press = (key: string, target: EventTarget | null, extra = {}) => ({
    key,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    target,
    ...extra,
  });

  it('accepts a plain slash on the page', () => {
    expect(isSearchShortcut(press('/', document.body))).toBe(true);
  });

  it('ignores slash typed into fields', () => {
    expect(isSearchShortcut(press('/', document.createElement('input')))).toBe(
      false,
    );
    expect(
      isSearchShortcut(press('/', document.createElement('textarea'))),
    ).toBe(false);
  });

  it('ignores other keys and modified slashes', () => {
    expect(isSearchShortcut(press('a', document.body))).toBe(false);
    expect(isSearchShortcut(press('/', document.body, { ctrlKey: true }))).toBe(
      false,
    );
  });
});
