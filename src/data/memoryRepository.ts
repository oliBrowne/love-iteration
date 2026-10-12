import type { Memory } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { memoriesStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createMemoryRepository(db: IDBDatabase): Repository<Memory> {
  // Newest first, by when each memory was written.
  return createStoreRepository<Memory>(db, memoriesStore, (a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
