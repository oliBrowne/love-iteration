import type { Reflection } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { reflectionsStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createReflectionRepository(
  db: IDBDatabase,
): Repository<Reflection> {
  // Newest week first. YYYY-MM-DD strings sort in calendar order.
  return createStoreRepository<Reflection>(db, reflectionsStore, (a, b) =>
    b.weekStart.localeCompare(a.weekStart),
  );
}
