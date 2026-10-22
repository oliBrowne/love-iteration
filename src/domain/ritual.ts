import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';
import { localDate, weekStart } from './time.ts';

// A small habit to do again and again. Cadence says how often.
export const ritualCadences = ['daily', 'weekly'] as const;
export type RitualCadence = (typeof ritualCadences)[number];

export type Ritual = RecordMetadata & {
  name: string;
  cadence: RitualCadence;
  // Set when the ritual is put away. Archived rituals are kept, not deleted.
  archivedAt?: string;
  // Set while the ritual is paused. A paused ritual is never due.
  pausedAt?: string;
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

// The newest completion date for a ritual, or undefined if it was never done.
export function lastCompletionDate(
  completions: Pick<RitualCompletion, 'ritualId' | 'date'>[],
  ritualId: string,
): string | undefined {
  // YYYY-MM-DD strings sort in calendar order.
  return completions
    .filter((item) => item.ritualId === ritualId)
    .map((item) => item.date)
    .sort()
    .at(-1);
}

// Active rituals not yet done in the current period: today's date for a daily
// ritual, this week's Monday for a weekly one.
export function dueRituals(
  rituals: Ritual[],
  completions: Pick<RitualCompletion, 'ritualId' | 'date'>[],
  now: Date = new Date(),
): Ritual[] {
  const today = localDate(now);
  const monday = weekStart(now);
  return rituals.filter((ritual) => {
    if (ritual.archivedAt !== undefined || ritual.pausedAt !== undefined) {
      return false;
    }
    const period = ritual.cadence === 'daily' ? today : monday;
    return !completions.some(
      (item) => item.ritualId === ritual.id && item.date === period,
    );
  });
}

// How many periods in a row a ritual was done, counting back from the current
// one. A current period not yet done does not break the streak, so a daily
// ritual still shows yesterday's run until today passes without a completion.
export function ritualStreak(
  completions: Pick<RitualCompletion, 'ritualId' | 'date'>[],
  ritual: Pick<Ritual, 'id' | 'cadence'>,
  now: Date = new Date(),
): number {
  const done = new Set(
    completions
      .filter((item) => item.ritualId === ritual.id)
      .map((item) => item.date),
  );
  const step = ritual.cadence === 'daily' ? 1 : 7;
  const firstDay = ritual.cadence === 'daily' ? now : parseWeekStart(now);
  // Build each earlier period from calendar parts so daylight saving is safe.
  const periodAt = (back: number): string =>
    localDate(
      new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() - back * step,
      ),
    );
  let back = done.has(periodAt(0)) ? 0 : 1;
  let streak = 0;
  while (done.has(periodAt(back))) {
    streak += 1;
    back += 1;
  }
  return streak;
}

function parseWeekStart(now: Date): Date {
  const [year = 0, month = 1, day = 1] = weekStart(now).split('-').map(Number);
  return new Date(year, month - 1, day);
}
