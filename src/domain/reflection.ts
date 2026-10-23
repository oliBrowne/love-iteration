import { isLocalDate } from './checkin.ts';
import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';

// A weekly look back. `weekStart` is the Monday of the week, YYYY-MM-DD.
// Every prompt is optional, so a partly answered week is still a record.
export type Reflection = RecordMetadata & {
  weekStart: string;
  whatWorked?: string;
  whatWasHard?: string;
  whatToTry?: string;
  appreciation?: string;
};

// Returns the week start, or throws a DomainError unless it is a real
// YYYY-MM-DD date that falls on a Monday.
export function parseReflectionWeek(value: unknown): string {
  if (!isLocalDate(value) || new Date(`${value}T00:00:00Z`).getUTCDay() !== 1) {
    throw new DomainError(
      'invalid-reflection-week',
      'Use the Monday that starts the week, written YYYY-MM-DD.',
    );
  }
  return value;
}
