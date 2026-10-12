import type { RecordMetadata } from './record.ts';

// A shared-or-personal memory worth keeping. `date` is a local calendar day,
// YYYY-MM-DD. `note` may be an empty string.
export type Memory = RecordMetadata & {
  title: string;
  date: string;
  note: string;
};
