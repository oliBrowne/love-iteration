import type { CheckIn } from '../domain/index.ts';
import { createCheckInRepository } from './checkinRepository.ts';
import { openDatabase } from './database.ts';
import type { Repository } from './repository.ts';

let repository: Promise<Repository<CheckIn>> | undefined;

// The app's single check-in repository, backed by the browser's IndexedDB.
export function getCheckInRepository(): Promise<Repository<CheckIn>> {
  repository ??= openDatabase().then(createCheckInRepository);
  return repository;
}
