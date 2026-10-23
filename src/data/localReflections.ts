import type { Reflection } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createReflectionRepository } from './reflectionRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<Reflection>> | undefined;

// The app's single reflection repository, backed by the browser's IndexedDB.
export function getReflectionRepository(): Promise<Repository<Reflection>> {
  repository ??= openDatabase().then(createReflectionRepository);
  return repository;
}
