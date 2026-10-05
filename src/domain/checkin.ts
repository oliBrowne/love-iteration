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
