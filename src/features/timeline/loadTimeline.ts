import {
  getCheckInRepository,
  getGratitudeRepository,
  getIdeaRepository,
  getMemoryRepository,
  getPlanRepository,
  getReflectionRepository,
  getRitualCompletionRepository,
  getRitualRepository,
} from '../../data/index.ts';
import type { Repository } from '../../data/index.ts';
import type { RecordMetadata } from '../../domain/index.ts';
import {
  checkInToTimelineEntry,
  gratitudeToTimelineEntry,
  memoryToTimelineEntry,
  mergeTimeline,
  planToTimelineEntry,
  reflectionToTimelineEntry,
  ritualCompletionToTimelineEntry,
} from '../../domain/index.ts';
import type {
  CheckIn,
  DateIdea,
  Gratitude,
  Memory,
  PlannedDate,
  Reflection,
  Ritual,
  RitualCompletion,
  TimelineEntry,
} from '../../domain/index.ts';

// Where the timeline reads from. Tests pass in-memory repositories.
export type TimelineSources = {
  checkIns: () => Promise<Repository<CheckIn>>;
  gratitude: () => Promise<Repository<Gratitude>>;
  memories: () => Promise<Repository<Memory>>;
  plans: () => Promise<Repository<PlannedDate>>;
  ideas: () => Promise<Repository<DateIdea>>;
  rituals: () => Promise<Repository<Ritual>>;
  ritualCompletions: () => Promise<Repository<RitualCompletion>>;
  reflections: () => Promise<Repository<Reflection>>;
};

export const localTimelineSources: TimelineSources = {
  checkIns: getCheckInRepository,
  gratitude: getGratitudeRepository,
  memories: getMemoryRepository,
  plans: getPlanRepository,
  ideas: getIdeaRepository,
  rituals: getRitualRepository,
  ritualCompletions: getRitualCompletionRepository,
  reflections: getReflectionRepository,
};

async function listAll<T extends RecordMetadata>(
  get: () => Promise<Repository<T>>,
): Promise<T[]> {
  return (await get()).list();
}

// Reads every record source and returns one feed, newest first.
export async function loadTimeline(
  sources: TimelineSources,
): Promise<TimelineEntry[]> {
  const [
    checkIns,
    gratitude,
    memories,
    plans,
    ideas,
    rituals,
    completions,
    reflections,
  ] = await Promise.all([
    listAll(sources.checkIns),
    listAll(sources.gratitude),
    listAll(sources.memories),
    listAll(sources.plans),
    listAll(sources.ideas),
    listAll(sources.rituals),
    listAll(sources.ritualCompletions),
    listAll(sources.reflections),
  ]);
  const ideaTitles = new Map(ideas.map((idea) => [idea.id, idea.title]));
  const ritualNames = new Map(
    rituals.map((ritual) => [ritual.id, ritual.name]),
  );
  return mergeTimeline(
    checkIns.map(checkInToTimelineEntry),
    gratitude.map(gratitudeToTimelineEntry),
    memories.map(memoryToTimelineEntry),
    plans.map((plan) =>
      planToTimelineEntry(plan, ideaTitles.get(plan.ideaId) ?? 'A date idea'),
    ),
    completions.map((completion) =>
      ritualCompletionToTimelineEntry(
        completion,
        ritualNames.get(completion.ritualId) ?? 'A ritual',
      ),
    ),
    reflections.map(reflectionToTimelineEntry),
  );
}
