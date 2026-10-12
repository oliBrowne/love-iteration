import type { Memory } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { memoriesStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createMemoryRepository(db: IDBDatabase): Repository<Memory> {
  // Newest memory date first; ties go to the most recently written.
  return createStoreRepository<Memory>(
    db,
    memoriesStore,
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}
