import { DomainError } from './errors.ts';
import { localDate } from './time.ts';
import type { RecordMetadata } from './record.ts';

// A small appreciation. `date` is a local calendar day, YYYY-MM-DD.
export type Gratitude = RecordMetadata & {
  date: string;
  text: string;
};

export const GRATITUDE_MAX_LENGTH = 500;

// Returns the trimmed text, or throws a DomainError when it is blank or too long.
export function parseGratitudeText(value: unknown): string {
  const text = typeof value === 'string' ? value.trim() : '';
  if (text === '') {
    throw new DomainError('blank-gratitude', 'Write a few words to save.');
  }
  if (text.length > GRATITUDE_MAX_LENGTH) {
    throw new DomainError(
      'long-gratitude',
      `Keep it under ${GRATITUDE_MAX_LENGTH} characters.`,
    );
  }
  return text;
}

// How many entries have a `date` in the current Monday-to-Sunday week.
export function countGratitudeThisWeek(
  entries: Pick<Gratitude, 'date'>[],
  now: Date = new Date(),
): number {
  const daysSinceMonday = (now.getDay() + 6) % 7;
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysSinceMonday,
  );
  const nextMonday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 7,
  );
  // YYYY-MM-DD strings sort in calendar order.
  const start = localDate(monday);
  const end = localDate(nextMonday);
  return entries.filter((e) => e.date >= start && e.date < end).length;
}
