import type { CheckIn } from '../domain/index.ts';
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

export function createCheckInRepository(
  db: IDBDatabase,
): Pick<Repository<CheckIn>, 'get' | 'put'> {
  return {
    async get(id) {
      const tx = db.transaction(checkinsStore, 'readonly');
      const record = await wrap<CheckIn | undefined>(
        tx.objectStore(checkinsStore).get(id),
      );
      return record;
    },
    async put(record) {
      const tx = db.transaction(checkinsStore, 'readwrite');
      tx.objectStore(checkinsStore).put(record);
      await committed(tx);
    },
  };
}
