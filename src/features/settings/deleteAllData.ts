import type { Repository } from '../../data/index.ts';
import type { RecordMetadata } from '../../domain/index.ts';
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
] as const satisfies readonly (keyof TimelineSources)[];

// Removes every stored record of every kind from this device.
export async function deleteAllData(
  sources: TimelineSources = localTimelineSources,
): Promise<void> {
  for (const kind of kinds) {
    const repository = (await sources[kind]()) as Repository<RecordMetadata>;
    for (const record of await repository.list()) {
      await repository.delete(record.id);
    }
  }
}
