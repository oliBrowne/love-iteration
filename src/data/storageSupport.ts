// True when this browser offers the local database the app stores records in.
export function storageSupported(factory: IDBFactory | undefined): boolean {
  return typeof factory?.open === 'function';
}

export const storageUnsupportedMessage =
  'This browser cannot save data on this device, so Love Iteration cannot keep what you write. Try a current version of Firefox, Chrome, Safari, or Edge, and turn off private browsing if it is on.';
