export const databaseName = 'love-iteration';
export const databaseVersion = 2;
export const checkinsStore = 'checkins';
export const gratitudeStore = 'gratitude';

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
      // Added in schema v2. Older databases gain it here; their records stay.
      if (!db.objectStoreNames.contains(gratitudeStore)) {
        db.createObjectStore(gratitudeStore, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open the local database.'));
  });
}
