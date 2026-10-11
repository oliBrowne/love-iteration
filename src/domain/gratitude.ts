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

// The distinct YYYY-MM months present in the entries, newest first.
export function gratitudeMonths(entries: Pick<Gratitude, 'date'>[]): string[] {
  const months = new Set(entries.map((e) => e.date.slice(0, 7)));
  return [...months].sort().reverse();
}

// Entries whose date is in the YYYY-MM month; an empty month keeps everything.
export function filterGratitudeByMonth<T extends Pick<Gratitude, 'date'>>(
  entries: T[],
  month: string,
): T[] {
  return month === ''
    ? entries
    : entries.filter((e) => e.date.startsWith(month));
}

// "2026-03" as a readable label such as "March 2026".
export function formatMonthLabel(month: string, locale?: string): string {
  const [year = 0, number = 1] = month.split('-').map(Number);
  return new Date(year, number - 1, 1).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });
}
