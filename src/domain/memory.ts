import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';

// A shared-or-personal memory worth keeping. `date` is a local calendar day,
// YYYY-MM-DD. `note` may be an empty string.
export type Memory = RecordMetadata & {
  title: string;
  date: string;
  note: string;
};

// Returns the trimmed title, or throws a DomainError when it is blank.
export function parseMemoryTitle(value: unknown): string {
  const title = typeof value === 'string' ? value.trim() : '';
  if (title === '') {
    throw new DomainError('blank-memory-title', 'Give this memory a title.');
  }
  return title;
}
