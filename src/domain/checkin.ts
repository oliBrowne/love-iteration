import type { RecordMetadata } from './record.ts';

// Moods a person can pick for a check-in, from lightest to heaviest.
export const moods = ['glowing', 'good', 'okay', 'low', 'rough'] as const;

export type Mood = (typeof moods)[number];

// A check-in. `date` is a local calendar day, YYYY-MM-DD.
export type CheckIn = RecordMetadata & {
  date: string;
  mood: Mood;
  note: string;
};
