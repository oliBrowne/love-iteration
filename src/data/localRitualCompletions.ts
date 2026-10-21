import type { RitualCompletion } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createRitualCompletionRepository } from './ritualCompletionRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<RitualCompletion>> | undefined;

// The app's single ritual completion repository, backed by IndexedDB.
export function getRitualCompletionRepository(): Promise<
  Repository<RitualCompletion>
> {
  repository ??= openDatabase().then(createRitualCompletionRepository);
  return repository;
}
