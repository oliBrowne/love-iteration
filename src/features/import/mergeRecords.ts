import type { RecordMetadata } from '../../domain/index.ts';

export type MergePlan<T extends RecordMetadata> = {
  toWrite: T[];
  added: number;
  updated: number;
  skipped: number;
};

// Decides which incoming records to write. A new ID is added; an existing ID is
// replaced only when the incoming updatedAt is newer; otherwise it is skipped.
export function planMerge<T extends RecordMetadata>(
  existing: T[],
  incoming: T[],
): MergePlan<T> {
  const byId = new Map(existing.map((record) => [record.id, record]));
  const plan: MergePlan<T> = { toWrite: [], added: 0, updated: 0, skipped: 0 };
  for (const record of incoming) {
    const current = byId.get(record.id);
    if (!current) {
      plan.toWrite.push(record);
      plan.added += 1;
    } else if (Date.parse(record.updatedAt) > Date.parse(current.updatedAt)) {
      plan.toWrite.push(record);
      plan.updated += 1;
    } else {
      plan.skipped += 1;
    }
  }
  return plan;
}
