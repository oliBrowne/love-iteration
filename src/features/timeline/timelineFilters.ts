import type { TimelineKind } from '../../domain/index.ts';

export type TimelineFilters = {
  kinds: TimelineKind[];
  from: string;
  to: string;
};

const noFilters: TimelineFilters = { kinds: [], from: '', to: '' };

// Held in memory only, so going to another page and back (or pressing Back)
// keeps the filters, but a reload starts fresh and nothing is stored.
let remembered: TimelineFilters = noFilters;

export function rememberedTimelineFilters(): TimelineFilters {
  return remembered;
}

export function rememberTimelineFilters(filters: TimelineFilters): void {
  remembered = filters;
}
