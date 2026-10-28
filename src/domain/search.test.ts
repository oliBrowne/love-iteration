import { describe, expect, it } from 'vitest';
import { normalizeSearchText, searchTextForEntry } from './search.ts';
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
