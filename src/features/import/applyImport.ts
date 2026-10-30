import type { ExportData } from '../export/exportData.ts';
import type { Repository } from '../../data/index.ts';
import type { RecordMetadata } from '../../domain/index.ts';
import { planMerge } from './mergeRecords.ts';
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

// Writes incoming records that are new or newer than the stored ones. Call it only after the person
// has confirmed the import.
export async function applyImport(
  data: ExportData,
  sources: TimelineSources = localTimelineSources,
): Promise<void> {
  for (const kind of kinds) {
    // Each kind has its own record type; merging only needs the metadata.
    const repository = (await sources[kind]()) as Repository<RecordMetadata>;
    const plan = planMerge(
      await repository.list(),
      data[kind] as RecordMetadata[],
    );
    for (const record of plan.toWrite) {
      await repository.put(record);
    }
  }
}
