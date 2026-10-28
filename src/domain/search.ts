import { timelineKindLabels } from './timeline.ts';
import type { TimelineEntry } from './timeline.ts';

// Lower-cases text, drops accents, and collapses any run of whitespace to one
// space, so matching ignores case, accents, and spacing.
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Keeps entries whose search text contains every word of the query. A blank
// query matches nothing, so an empty search box shows no results.
export function searchEntries(
  entries: TimelineEntry[],
  query: string,
): TimelineEntry[] {
  const words = normalizeSearchText(query).split(' ').filter(Boolean);
  if (words.length === 0) return [];
  return entries.filter((entry) => {
    const text = searchTextForEntry(entry);
    return words.every((word) => text.includes(word));
  });
}

// The text a search query is matched against for one record: its summary and
// the label of its kind, so "gratitude" finds gratitude entries.
export function searchTextForEntry(entry: TimelineEntry): string {
  return normalizeSearchText(
    `${timelineKindLabels[entry.kind]} ${entry.summary}`,
  );
}
