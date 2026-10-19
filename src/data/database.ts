export const databaseName = 'love-iteration';
export const databaseVersion = 6;
export const checkinsStore = 'checkins';
export const gratitudeStore = 'gratitude';
export const memoriesStore = 'memories';
export const ideasStore = 'ideas';
export const plansStore = 'plans';
export const ritualsStore = 'rituals';

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
      // Added in schema v3.
      if (!db.objectStoreNames.contains(memoriesStore)) {
        db.createObjectStore(memoriesStore, { keyPath: 'id' });
      }
      // Added in schema v4.
      if (!db.objectStoreNames.contains(ideasStore)) {
        db.createObjectStore(ideasStore, { keyPath: 'id' });
      }
      // Added in schema v5.
      if (!db.objectStoreNames.contains(plansStore)) {
        db.createObjectStore(plansStore, { keyPath: 'id' });
      }
      // Added in schema v6.
      if (!db.objectStoreNames.contains(ritualsStore)) {
        db.createObjectStore(ritualsStore, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open the local database.'));
  });
}
