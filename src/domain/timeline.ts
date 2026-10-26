// The kinds of local record that appear as dated moments in the timeline.
// Date ideas and rituals are lists of things to do rather than moments that
// happened, so they are found in their own pages instead.
export const timelineKinds = [
  'checkin',
  'gratitude',
  'memory',
  'plan',
  'ritual-completion',
  'reflection',
] as const;

export type TimelineKind = (typeof timelineKinds)[number];

// One line in the timeline feed, built from a single stored record.
export type TimelineEntry = {
  // The source record's ID. Unique within a kind, so use `kind` too as a key.
  id: string;
  kind: TimelineKind;
  // When the moment happened: a YYYY-MM-DD day, or the Monday of a reflection week.
  date: string;
  // A short plain-text line describing the record.
  summary: string;
  // The source record's createdAt, used to order entries on the same day.
  createdAt: string;
};
