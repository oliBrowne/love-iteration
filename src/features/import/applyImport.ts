import type { Repository } from '../../data/index.ts';
import type { RecordMetadata } from '../../domain/index.ts';
import type { ExportData } from '../export/exportData.ts';
import { localTimelineSources } from '../timeline/loadTimeline.ts';
import type { TimelineSources } from '../timeline/loadTimeline.ts';
import { planMerge } from './mergeRecords.ts';

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

export type ImportSummary = { added: number; updated: number; skipped: number };

type KindPlan = {
  repository: Repository<RecordMetadata>;
  toWrite: RecordMetadata[];
};

// Works out what an import would do, without writing anything.
async function planImport(data: ExportData, sources: TimelineSources) {
  const plans: KindPlan[] = [];
  const summary: ImportSummary = { added: 0, updated: 0, skipped: 0 };
  for (const kind of kinds) {
    // Each kind has its own record type; merging only needs the metadata.
    const repository = (await sources[kind]()) as Repository<RecordMetadata>;
    const plan = planMerge(
      await repository.list(),
      data[kind] as RecordMetadata[],
    );
    plans.push({ repository, toWrite: plan.toWrite });
    summary.added += plan.added;
    summary.updated += plan.updated;
    summary.skipped += plan.skipped;
  }
  return { plans, summary };
}

// How many records an import would add, replace with a newer version, or skip.
export async function summarizeImport(
  data: ExportData,
  sources: TimelineSources = localTimelineSources,
): Promise<ImportSummary> {
  return (await planImport(data, sources)).summary;
}

// Writes incoming records that are new or newer than the stored ones. Call it
// only after the person has confirmed the import.
export async function applyImport(
  data: ExportData,
  sources: TimelineSources = localTimelineSources,
): Promise<ImportSummary> {
  const { plans, summary } = await planImport(data, sources);
  for (const { repository, toWrite } of plans) {
    for (const record of toWrite) await repository.put(record);
  }
  return summary;
}
