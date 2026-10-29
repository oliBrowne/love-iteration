import { createExportEnvelope } from '../../domain/index.ts';
import type {
  CheckIn,
  DateIdea,
  ExportEnvelope,
  Gratitude,
  Memory,
  PlannedDate,
  Reflection,
  Ritual,
  RitualCompletion,
} from '../../domain/index.ts';
import { localTimelineSources } from '../timeline/loadTimeline.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

// Every kind of stored record, by name. Date ideas and rituals are included
// because plans and ritual completions refer to them.
export type ExportData = {
  checkIns: CheckIn[];
  gratitude: Gratitude[];
  memories: Memory[];
  plans: PlannedDate[];
  ideas: DateIdea[];
  rituals: Ritual[];
  ritualCompletions: RitualCompletion[];
  reflections: Reflection[];
};

// Reads every record kind and wraps them in the versioned export envelope.
export async function buildExport(
  sources: TimelineSources = localTimelineSources,
  now: Date = new Date(),
): Promise<ExportEnvelope<ExportData>> {
  const [
    checkIns,
    gratitude,
    memories,
    plans,
    ideas,
    rituals,
    ritualCompletions,
    reflections,
  ] = await Promise.all([
    sources.checkIns().then((r) => r.list()),
    sources.gratitude().then((r) => r.list()),
    sources.memories().then((r) => r.list()),
    sources.plans().then((r) => r.list()),
    sources.ideas().then((r) => r.list()),
    sources.rituals().then((r) => r.list()),
    sources.ritualCompletions().then((r) => r.list()),
    sources.reflections().then((r) => r.list()),
  ]);
  return createExportEnvelope(
    {
      checkIns,
      gratitude,
      memories,
      plans,
      ideas,
      rituals,
      ritualCompletions,
      reflections,
    },
    now,
  );
}

// The export as pretty-printed JSON text, ready to save to a file.
export async function serializeExport(
  sources?: TimelineSources,
  now?: Date,
): Promise<string> {
  return JSON.stringify(await buildExport(sources, now), null, 2);
}
