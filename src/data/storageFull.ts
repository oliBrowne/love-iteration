export const storageFullMessage =
  'This device has no room left to save. Nothing was lost. Open Settings and choose "Download export" to keep a copy, then free up space on this device and try again.';

// Thrown when the browser refuses a write because storage is full.
export class StorageFullError extends Error {
  constructor() {
    super(storageFullMessage);
    this.name = 'StorageFullError';
  }
}

// Turns a browser quota failure into a StorageFullError; other errors pass through.
export function explainStorageError(error: unknown): unknown {
  return error instanceof DOMException && error.name === 'QuotaExceededError'
    ? new StorageFullError()
    : error;
}
