// Whether this person has chosen to turn on sharing. Sharing is off until they
// say so, and the choice only lives on this device. Storage can be missing or
// blocked, so every access is guarded and "off" is the answer when unsure.
export const sharingChoiceKey = 'love-iteration.sharing';

export type SharingChoice = 'off' | 'on';

export function readSharingChoice(
  storage: Pick<Storage, 'getItem'> | undefined = safeStorage(),
): SharingChoice {
  try {
    return storage?.getItem(sharingChoiceKey) === 'on' ? 'on' : 'off';
  } catch {
    return 'off';
  }
}

// Returns false when the choice could not be saved.
export function saveSharingChoice(
  choice: SharingChoice,
  storage: Pick<Storage, 'setItem'> | undefined = safeStorage(),
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(sharingChoiceKey, choice);
    return true;
  } catch {
    return false;
  }
}

function safeStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
