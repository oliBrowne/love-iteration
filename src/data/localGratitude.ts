import type { Gratitude } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createGratitudeRepository } from './gratitudeRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<Gratitude>> | undefined;

// The app's single gratitude repository, backed by the browser's IndexedDB.
export function getGratitudeRepository(): Promise<Repository<Gratitude>> {
  repository ??= openDatabase().then(createGratitudeRepository);
  return repository;
}
