import { DomainError } from './errors.ts';
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
