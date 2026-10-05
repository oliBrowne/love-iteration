import { IDBFactory } from 'fake-indexeddb';
import { describe, expect, it } from 'vitest';
import { checkinsStore, databaseName, openDatabase } from './database.ts';

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
});
