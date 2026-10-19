import type { Ritual } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createRitualRepository } from './ritualRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<Ritual>> | undefined;

// The app's single ritual repository, backed by the browser's IndexedDB.
export function getRitualRepository(): Promise<Repository<Ritual>> {
  repository ??= openDatabase().then(createRitualRepository);
  return repository;
}
