import type { DateIdea } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { ideasStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createIdeaRepository(db: IDBDatabase): Repository<DateIdea> {
  // Newest idea first for now; active-before-completed ordering comes next.
  return createStoreRepository<DateIdea>(db, ideasStore, (a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
