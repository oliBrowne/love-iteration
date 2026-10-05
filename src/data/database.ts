export const databaseName = 'love-iteration';
export const databaseVersion = 1;
export const checkinsStore = 'checkins';

// Opens the local database, creating the object stores on first use.
export function openDatabase(
  factory: IDBFactory = indexedDB,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = factory.open(databaseName, databaseVersion);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(checkinsStore)) {
        db.createObjectStore(checkinsStore, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open the local database.'));
  });
}
