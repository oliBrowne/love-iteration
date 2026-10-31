// Storage repositories live here. UI code must go through them, never storage directly.
export type { Repository } from './repository.ts';
export {
  checkinsStore,
  databaseName,
  databaseVersion,
  gratitudeStore,
  ideasStore,
  memoriesStore,
  openDatabase,
  plansStore,
  reflectionsStore,
  ritualCompletionsStore,
  ritualsStore,
} from './database.ts';
export {
  createCheckInRepository,
  createStoreRepository,
} from './checkinRepository.ts';
export { createGratitudeRepository } from './gratitudeRepository.ts';
export { createMemoryRepository } from './memoryRepository.ts';
export { getCheckInRepository } from './localCheckIns.ts';
export { getGratitudeRepository } from './localGratitude.ts';
export { getMemoryRepository } from './localMemories.ts';
export { createIdeaRepository } from './ideaRepository.ts';
export { getIdeaRepository } from './localIdeas.ts';
export { createPlanRepository } from './planRepository.ts';
export { getPlanRepository } from './localPlans.ts';
export { createRitualRepository } from './ritualRepository.ts';
export { getRitualRepository } from './localRituals.ts';
export { createRitualCompletionRepository } from './ritualCompletionRepository.ts';
export { getRitualCompletionRepository } from './localRitualCompletions.ts';
export { createReflectionRepository } from './reflectionRepository.ts';
export { getReflectionRepository } from './localReflections.ts';
export {
  storageSupported,
  storageUnsupportedMessage,
} from './storageSupport.ts';
export {
  explainStorageError,
  StorageFullError,
  storageFullMessage,
} from './storageFull.ts';
