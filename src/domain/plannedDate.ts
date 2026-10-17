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
