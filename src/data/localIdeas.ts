import type { DateIdea } from '../domain/index.ts';
import { openDatabase } from './database.ts';
import { createIdeaRepository } from './ideaRepository.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<DateIdea>> | undefined;

// The app's single idea repository, backed by the browser's IndexedDB.
export function getIdeaRepository(): Promise<Repository<DateIdea>> {
  repository ??= openDatabase().then(createIdeaRepository);
  return repository;
}
