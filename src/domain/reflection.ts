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
