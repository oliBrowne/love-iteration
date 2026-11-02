import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { createCheckInRepository } from './checkinRepository.ts';
import {
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

// Builds a database the way the first release did, then adds one saved record.
function seedOlderDatabase(factory: IDBFactory, record: object) {
  return new Promise<void>((resolve, reject) => {
    const request = factory.open(databaseName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(checkinsStore, { keyPath: 'id' });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(checkinsStore, 'readwrite');
      tx.objectStore(checkinsStore).put(record);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
    };
  });
}

describe('openDatabase', () => {
  it('creates the checkins, gratitude, memories, ideas, plans, rituals and ritual completions and reflections stores keyed by id', async () => {
    const db = await openDatabase(new IDBFactory());
    expect(db.name).toBe(databaseName);
    expect([...db.objectStoreNames].sort()).toEqual(
      [
        checkinsStore,
        gratitudeStore,
        memoriesStore,
        ideasStore,
        plansStore,
        ritualsStore,
        ritualCompletionsStore,
        reflectionsStore,
      ].sort(),
    );
    const gratitude = db
      .transaction(gratitudeStore)
      .objectStore(gratitudeStore);
    expect(gratitude.keyPath).toBe('id');
    const memories = db.transaction(memoriesStore).objectStore(memoriesStore);
    expect(memories.keyPath).toBe('id');
    const ideas = db.transaction(ideasStore).objectStore(ideasStore);
    expect(ideas.keyPath).toBe('id');
    const plans = db.transaction(plansStore).objectStore(plansStore);
    expect(plans.keyPath).toBe('id');
    const rituals = db.transaction(ritualsStore).objectStore(ritualsStore);
    expect(rituals.keyPath).toBe('id');
    const completions = db
      .transaction(ritualCompletionsStore)
      .objectStore(ritualCompletionsStore);
    expect(completions.keyPath).toBe('id');
    const reflections = db
      .transaction(reflectionsStore)
      .objectStore(reflectionsStore);
    expect(reflections.keyPath).toBe('id');
    const store = db.transaction(checkinsStore).objectStore(checkinsStore);
    expect(store.keyPath).toBe('id');
    db.close();
  });

  it('can be opened again without losing the store', async () => {
    const factory = new IDBFactory();
    (await openDatabase(factory)).close();
    const db = await openDatabase(factory);
    expect(db.objectStoreNames.contains(checkinsStore)).toBe(true);
    db.close();
  });

  it('opens an older database without losing its records', async () => {
    const factory = new IDBFactory();
    const saved = {
      id: 'old-1',
      schemaVersion: 1,
      createdAt: '2025-12-31T10:00:00.000Z',
      updatedAt: '2025-12-31T10:00:00.000Z',
      date: '2025-12-31',
      mood: 'good',
      note: 'Demo note from an older version',
    };
    await seedOlderDatabase(factory, saved);

    const db = await openDatabase(factory);
    expect(db.version).toBeGreaterThanOrEqual(1);
    expect(db.version).toBe(databaseVersion);
    expect(await createCheckInRepository(db).list()).toEqual([saved]);
    expect(db.objectStoreNames.contains(gratitudeStore)).toBe(true);
    expect(db.objectStoreNames.contains(memoriesStore)).toBe(true);
    expect(db.objectStoreNames.contains(ideasStore)).toBe(true);
    expect(db.objectStoreNames.contains(plansStore)).toBe(true);
    expect(db.objectStoreNames.contains(ritualsStore)).toBe(true);
    expect(db.objectStoreNames.contains(ritualCompletionsStore)).toBe(true);
    expect(db.objectStoreNames.contains(reflectionsStore)).toBe(true);
    db.close();
  });
});

describe('a migration that fails', () => {
  it('leaves the old data and version available', async () => {
    const factory = new IDBFactory();
    const record = { id: 'old-1', date: '2026-01-01', mood: 'good', note: '' };
    await seedOlderDatabase(factory, record);

    // A deliberately bad upgrade: it adds a store, then fails and aborts.
    const failed = await new Promise<boolean>((resolve) => {
      const request = factory.open(databaseName, 2);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('half-made', { keyPath: 'id' });
        request.transaction?.abort();
      };
      request.onsuccess = () => resolve(false);
      request.onerror = () => resolve(true);
    });
    expect(failed).toBe(true);

    // The rolled-back database is still version 1, with the record and no new store.
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = factory.open(databaseName);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    expect(db.version).toBe(1);
    expect([...db.objectStoreNames]).toEqual([checkinsStore]);
    const saved = await new Promise((resolve, reject) => {
      const request = db
        .transaction(checkinsStore)
        .objectStore(checkinsStore)
        .get('old-1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    expect(saved).toEqual(record);
    db.close();
  });
});
