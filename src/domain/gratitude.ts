import type { RecordMetadata } from './record.ts';

// A small appreciation. `date` is a local calendar day, YYYY-MM-DD.
export type Gratitude = RecordMetadata & {
  date: string;
  text: string;
};
