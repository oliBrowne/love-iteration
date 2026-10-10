import type { Gratitude } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { gratitudeStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createGratitudeRepository(
  db: IDBDatabase,
): Repository<Gratitude> {
  return createStoreRepository<Gratitude>(db, gratitudeStore);
}
