import type { Ritual } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { ritualsStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createRitualRepository(db: IDBDatabase): Repository<Ritual> {
  return createStoreRepository<Ritual>(db, ritualsStore, (a, b) =>
    a.name.localeCompare(b.name),
  );
}
