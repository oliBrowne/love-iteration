import type { RecordMetadata } from './record.ts';

// An idea for time together. Active ideas are still to do; completed ones are done.
export const dateIdeaStates = ['active', 'completed'] as const;
export type DateIdeaState = (typeof dateIdeaStates)[number];

// `note` may be an empty string.
export type DateIdea = RecordMetadata & {
  title: string;
  note: string;
  state: DateIdeaState;
};
