import type { Gratitude } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { gratitudeStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createGratitudeRepository(
  db: IDBDatabase,
): Repository<Gratitude> {
  // Newest first, by when each appreciation was written.
  return createStoreRepository<Gratitude>(db, gratitudeStore, (a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
