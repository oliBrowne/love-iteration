import { moodLabels } from './checkin.ts';
import type { CheckIn } from './checkin.ts';
import type { Gratitude } from './gratitude.ts';
import type { Memory } from './memory.ts';

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

// Longest summary line. Longer text is cut with an ellipsis.
export const SUMMARY_MAX_LENGTH = 120;

function shorten(text: string): string {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length > SUMMARY_MAX_LENGTH
    ? `${oneLine.slice(0, SUMMARY_MAX_LENGTH - 1)}…`
    : oneLine;
}

// A check-in reads as its mood, followed by the note when there is one.
export function checkInToTimelineEntry(checkIn: CheckIn): TimelineEntry {
  const note = shorten(checkIn.note);
  const mood = `Feeling ${moodLabels[checkIn.mood].toLowerCase()}`;
  return {
    id: checkIn.id,
    kind: 'checkin',
    date: checkIn.date,
    summary: note ? `${mood}: ${note}` : mood,
    createdAt: checkIn.createdAt,
  };
}

// A gratitude entry reads as its text.
export function gratitudeToTimelineEntry(gratitude: Gratitude): TimelineEntry {
  return {
    id: gratitude.id,
    kind: 'gratitude',
    date: gratitude.date,
    summary: shorten(gratitude.text),
    createdAt: gratitude.createdAt,
  };
}

// A memory reads as its title, followed by the note when there is one.
export function memoryToTimelineEntry(memory: Memory): TimelineEntry {
  const note = shorten(memory.note);
  return {
    id: memory.id,
    kind: 'memory',
    date: memory.date,
    summary: shorten(note ? `${memory.title}: ${note}` : memory.title),
    createdAt: memory.createdAt,
  };
}
