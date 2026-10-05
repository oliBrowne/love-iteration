import type { RecordMetadata } from './record.ts';
import { DomainError } from './errors.ts';

// Moods a person can pick for a check-in, from lightest to heaviest.
export const moods = ['glowing', 'good', 'okay', 'low', 'rough'] as const;

export type Mood = (typeof moods)[number];

// A check-in. `date` is a local calendar day, YYYY-MM-DD.
export type CheckIn = RecordMetadata & {
  date: string;
  mood: Mood;
  note: string;
};

export function isMood(value: unknown): value is Mood {
  return (
    typeof value === 'string' && (moods as readonly string[]).includes(value)
  );
}

// Returns the mood, or throws a DomainError for an unsupported value.
export function parseMood(value: unknown): Mood {
  if (!isMood(value)) {
    throw new DomainError('invalid-mood', 'Pick one of the listed moods.');
  }
  return value;
}

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

// A local calendar day written YYYY-MM-DD that really exists (no 2026-02-30).
export function isLocalDate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = datePattern.exec(value);
  if (!match) return false;
  const [year, month, day] = [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
  ];
  const probe = new Date(Date.UTC(year, month - 1, day));
  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

// Returns the date, or throws a DomainError for a malformed one.
export function parseLocalDate(value: unknown): string {
  if (!isLocalDate(value)) {
    throw new DomainError(
      'invalid-date',
      'Use a real date written YYYY-MM-DD.',
    );
  }
  return value;
}

export const moodLabels: Record<Mood, string> = {
  glowing: 'Glowing',
  good: 'Good',
  okay: 'Okay',
  low: 'Low',
  rough: 'Rough',
};

export const noteMaxLength = 500;

// Characters left in the note; negative once the note is over the limit.
export function noteRemaining(note: string): number {
  return noteMaxLength - note.length;
}
