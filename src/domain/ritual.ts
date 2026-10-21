import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';

// A small habit to do again and again. Cadence says how often.
export const ritualCadences = ['daily', 'weekly'] as const;
export type RitualCadence = (typeof ritualCadences)[number];

export type Ritual = RecordMetadata & {
  name: string;
  cadence: RitualCadence;
  // Set when the ritual is put away. Archived rituals are kept, not deleted.
  archivedAt?: string;
};

// Returns the trimmed name, or throws a DomainError when it is blank.
export function parseRitualName(value: unknown): string {
  const name = typeof value === 'string' ? value.trim() : '';
  if (name === '') {
    throw new DomainError('blank-ritual-name', 'Give this ritual a name.');
  }
  return name;
}

// Returns the cadence, or throws a DomainError unless it is daily or weekly.
export function parseRitualCadence(value: unknown): RitualCadence {
  const cadence = ritualCadences.find((option) => option === value);
  if (cadence === undefined) {
    throw new DomainError(
      'invalid-ritual-cadence',
      'Choose daily or weekly for this ritual.',
    );
  }
  return cadence;
}

// One time a ritual was done. For a weekly ritual, date is the week's start day.
export type RitualCompletion = RecordMetadata & {
  ritualId: string;
  date: string;
};
