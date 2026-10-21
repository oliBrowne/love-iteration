import type { RitualCompletion } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { ritualCompletionsStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createRitualCompletionRepository(
  db: IDBDatabase,
): Repository<RitualCompletion> {
  return createStoreRepository<RitualCompletion>(
    db,
    ritualCompletionsStore,
    (a, b) => b.date.localeCompare(a.date),
  );
}
