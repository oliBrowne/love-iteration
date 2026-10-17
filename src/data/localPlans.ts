import type { PlannedDate } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createPlanRepository } from './planRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<PlannedDate>> | undefined;

// The app's single plan repository, backed by the browser's IndexedDB.
export function getPlanRepository(): Promise<Repository<PlannedDate>> {
  repository ??= openDatabase().then(createPlanRepository);
  return repository;
}
