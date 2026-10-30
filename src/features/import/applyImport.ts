import type { ExportData } from '../export/exportData.ts';
import { localTimelineSources } from '../timeline/loadTimeline.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';

const kinds = [
  'checkIns',
  'gratitude',
  'memories',
  'plans',
  'ideas',
  'rituals',
  'ritualCompletions',
  'reflections',
] as const satisfies readonly (keyof ExportData)[];

// Writes every incoming record to local storage. Call it only after the person
// has confirmed the import.
export async function applyImport(
  data: ExportData,
  sources: TimelineSources = localTimelineSources,
): Promise<void> {
  for (const kind of kinds) {
    const repository = await sources[kind]();
    for (const record of data[kind]) {
      // Each list is typed by its own kind; the repository matches it.
      await (repository as { put(record: unknown): Promise<void> }).put(record);
    }
  }
}
