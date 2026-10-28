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

// The text a search query is matched against for one record: its summary and
// the label of its kind, so "gratitude" finds gratitude entries.
export function searchTextForEntry(entry: TimelineEntry): string {
  return normalizeSearchText(
    `${timelineKindLabels[entry.kind]} ${entry.summary}`,
  );
}
