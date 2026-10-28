import { timelineKindLabels, timelineKinds } from './timeline.ts';
import type { TimelineEntry, TimelineKind } from './timeline.ts';

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

// A run of search results of the same kind.
export type SearchGroup = { kind: TimelineKind; entries: TimelineEntry[] };

// Splits results into one group per kind, in the order of `timelineKinds`,
// keeping each group's result order. Kinds with no results are left out.
export function groupSearchResults(entries: TimelineEntry[]): SearchGroup[] {
  return timelineKinds
    .map((kind) => ({
      kind,
      entries: entries.filter((entry) => entry.kind === kind),
    }))
    .filter((group) => group.entries.length > 0);
}

// True when a key press should jump to the search box: a plain "/" that is not
// being typed into a field, so it never steals the character from a note.
export function isSearchShortcut(event: {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  target: EventTarget | null;
}): boolean {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }
  const target = event.target as HTMLElement | null;
  if (!target) return true;
  return !(
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
}
