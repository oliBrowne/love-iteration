import { DomainError } from './errors.ts';
import type { RecordMetadata } from './record.ts';

// A date idea given a day and time. `startsAt` is an ISO timestamp.
// Planned dates are upcoming, done happened, and cancelled did not.
export const plannedDateStatuses = ['planned', 'done', 'cancelled'] as const;
export type PlannedDateStatus = (typeof plannedDateStatuses)[number];

export type PlannedDate = RecordMetadata & {
  ideaId: string;
  startsAt: string;
  status: PlannedDateStatus;
};

// Turns a local "YYYY-MM-DDTHH:mm" value (as a datetime-local input gives it)
// into an ISO timestamp. Throws a DomainError for anything that is not a real
// day and time, such as 30 February or 25:00.
export function parsePlannedStart(value: unknown): string {
  const match =
    typeof value === 'string'
      ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim())
      : null;
  if (match) {
    const [year, month, day, hour, minute] = match.slice(1).map(Number) as [
      number,
      number,
      number,
      number,
      number,
    ];
    const local = new Date(year, month - 1, day, hour, minute);
    if (
      local.getFullYear() === year &&
      local.getMonth() === month - 1 &&
      local.getDate() === day &&
      local.getHours() === hour &&
      local.getMinutes() === minute
    ) {
      return local.toISOString();
    }
  }
  throw new DomainError('invalid-planned-start', 'Choose a real day and time.');
}

// Plans that are still planned and start after `now`, soonest first.
export function upcomingPlans(
  plans: PlannedDate[],
  now: Date = new Date(),
): PlannedDate[] {
  const cutoff = now.toISOString();
  return plans
    .filter((plan) => plan.status === 'planned' && plan.startsAt > cutoff)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
