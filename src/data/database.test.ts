import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { createCheckInRepository } from './checkinRepository.ts';
import {
  checkinsStore,
  databaseName,
  databaseVersion,
  openDatabase,
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
  it('creates the checkins store keyed by id', async () => {
    const db = await openDatabase(new IDBFactory());
    expect(db.name).toBe(databaseName);
    expect([...db.objectStoreNames]).toEqual([checkinsStore]);
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
    db.close();
  });
});
