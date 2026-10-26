import { moodLabels } from './checkin.ts';
import type { CheckIn } from './checkin.ts';
import type { Gratitude } from './gratitude.ts';
import type { Memory } from './memory.ts';
import type { PlannedDate } from './plannedDate.ts';
import type { Reflection } from './reflection.ts';
import type { RitualCompletion } from './ritual.ts';
import { localDate } from './time.ts';

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

const planPrefix = {
  planned: 'Planned',
  done: 'Enjoyed',
  cancelled: 'Cancelled',
} as const;

// A plan reads as its status and the idea's title, on the local day it starts.
// The title lives on the date idea, so the caller passes it in.
export function planToTimelineEntry(
  plan: PlannedDate,
  ideaTitle: string,
): TimelineEntry {
  return {
    id: plan.id,
    kind: 'plan',
    date: localDate(new Date(plan.startsAt)),
    summary: shorten(`${planPrefix[plan.status]}: ${ideaTitle}`),
    createdAt: plan.createdAt,
  };
}

// A completion reads as the ritual's name, which the caller passes in because
// the completion only stores the ritual's id.
export function ritualCompletionToTimelineEntry(
  completion: RitualCompletion,
  ritualName: string,
): TimelineEntry {
  return {
    id: completion.id,
    kind: 'ritual-completion',
    date: completion.date,
    summary: shorten(`Ritual: ${ritualName}`),
    createdAt: completion.createdAt,
  };
}

// A reflection sits on the Monday that starts its week. It reads as the first
// prompt that was answered, or just "Weekly reflection" if none were.
export function reflectionToTimelineEntry(
  reflection: Reflection,
): TimelineEntry {
  const first = [
    reflection.whatWorked,
    reflection.whatWasHard,
    reflection.whatToTry,
    reflection.appreciation,
    reflection.nextAction,
  ]
    .map((text) => shorten(text ?? ''))
    .find((text) => text !== '');
  return {
    id: reflection.id,
    kind: 'reflection',
    date: reflection.weekStart,
    summary: shorten(
      first ? `Weekly reflection: ${first}` : 'Weekly reflection',
    ),
    createdAt: reflection.createdAt,
  };
}
