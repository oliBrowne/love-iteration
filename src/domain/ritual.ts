import type { RecordMetadata } from './record.ts';

// A small habit to do again and again. Cadence says how often.
export const ritualCadences = ['daily', 'weekly'] as const;
export type RitualCadence = (typeof ritualCadences)[number];

export type Ritual = RecordMetadata & {
  name: string;
  cadence: RitualCadence;
};
