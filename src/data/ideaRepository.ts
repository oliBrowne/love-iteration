import type { DateIdea } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { ideasStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createIdeaRepository(db: IDBDatabase): Repository<DateIdea> {
  // Active ideas first, then completed; newest first within each group.
  return createStoreRepository<DateIdea>(
    db,
    ideasStore,
    (a, b) =>
      Number(a.state === 'completed') - Number(b.state === 'completed') ||
      b.createdAt.localeCompare(a.createdAt),
  );
}
