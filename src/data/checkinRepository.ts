import type { CheckIn, RecordMetadata } from '../domain/index.ts';
import { checkinsStore } from './database.ts';
import type { Repository } from './repository.ts';

// Wraps one IndexedDB request in a promise.
function wrap<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Local storage request failed.'));
  });
}

// Resolves once the transaction has committed, so a read after it sees the write.
function committed(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error ?? new Error('Local storage write failed.'));
    tx.onabort = () =>
      reject(tx.error ?? new Error('Local storage write was cancelled.'));
  });
}

// A repository over one IndexedDB object store. `compare` orders list().
export function createStoreRepository<T extends RecordMetadata>(
  db: IDBDatabase,
  store: string,
  compare?: (a: T, b: T) => number,
): Repository<T> {
  return {
    async get(id) {
      const tx = db.transaction(store, 'readonly');
      return wrap<T | undefined>(tx.objectStore(store).get(id));
    },
    async list() {
      const tx = db.transaction(store, 'readonly');
      const records = await wrap<T[]>(tx.objectStore(store).getAll());
      return compare ? records.sort(compare) : records;
    },
    async put(record) {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(record);
      await committed(tx);
    },
    async delete(id) {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(id);
      await committed(tx);
    },
  };
}

export function createCheckInRepository(db: IDBDatabase): Repository<CheckIn> {
  // Newest day first; the latest update wins within one day.
  return createStoreRepository<CheckIn>(
    db,
    checkinsStore,
    (a, b) =>
      b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
  );
}
