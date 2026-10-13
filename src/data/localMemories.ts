import type { Memory } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createMemoryRepository } from './memoryRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<Memory>> | undefined;

// The app's single memory repository, backed by the browser's IndexedDB.
export function getMemoryRepository(): Promise<Repository<Memory>> {
  repository ??= openDatabase().then(createMemoryRepository);
  return repository;
}
