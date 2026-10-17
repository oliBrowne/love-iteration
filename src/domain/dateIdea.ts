import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';

// An idea for time together. Active ideas are still to do; completed ones are done.
export const dateIdeaStates = ['active', 'completed'] as const;
export type DateIdeaState = (typeof dateIdeaStates)[number];

// What kind of time together an idea is. Ideas saved before categories existed have none.
export const dateIdeaCategories = [
  'outing',
  'at-home',
  'trip',
  'other',
] as const;
export type DateIdeaCategory = (typeof dateIdeaCategories)[number];

export const dateIdeaCategoryLabels: Record<DateIdeaCategory, string> = {
  outing: 'Outing',
  'at-home': 'At home',
  trip: 'Trip',
  other: 'Other',
};

// `note` may be an empty string.
export type DateIdea = RecordMetadata & {
  title: string;
  note: string;
  state: DateIdeaState;
  category?: DateIdeaCategory;
};

// Returns the trimmed title, or throws a DomainError when it is blank.
export function parseDateIdeaTitle(value: unknown): string {
  const title = typeof value === 'string' ? value.trim() : '';
  if (title === '') {
    throw new DomainError('blank-idea-title', 'Give this idea a title.');
  }
  return title;
}

// Keeps ideas in the chosen category; an empty filter keeps every idea.
export function filterIdeasByCategory(
  ideas: DateIdea[],
  category: DateIdeaCategory | '',
): DateIdea[] {
  return category === ''
    ? ideas
    : ideas.filter((idea) => idea.category === category);
}

// Keeps ideas whose title or note contains the text, ignoring case.
// Blank text keeps every idea.
export function searchIdeas(ideas: DateIdea[], text: string): DateIdea[] {
  const needle = text.trim().toLowerCase();
  if (needle === '') return ideas;
  return ideas.filter((idea) =>
    `${idea.title}\n${idea.note}`.toLowerCase().includes(needle),
  );
}
