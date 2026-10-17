import type { PlannedDate } from '../domain/index.ts';
import { createStoreRepository } from './checkinRepository.ts';
import { plansStore } from './database.ts';
import type { Repository } from './repository.ts';

export function createPlanRepository(db: IDBDatabase): Repository<PlannedDate> {
  // Soonest plan first.
  return createStoreRepository<PlannedDate>(db, plansStore, (a, b) =>
    a.startsAt.localeCompare(b.startsAt),
  );
}
