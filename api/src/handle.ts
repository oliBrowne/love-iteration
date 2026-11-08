export type HandleResult =
  { ok: true; handle: string } | { ok: false; reason: string };

// Names that could be mistaken for the service itself or a staff account.
const reserved = new Set(['admin', 'root', 'api', 'support', 'system', 'me']);

// Checks an account handle. Surrounding spaces are trimmed and letters are
// lowercased, so "Sam " and "sam" are the same handle. A handle is 3 to 32
// characters: letters, digits, "_" or "-", starting with a letter.
export function validateHandle(input: string): HandleResult {
  const handle = input.trim().toLowerCase();
  if (handle === '') {
    return { ok: false, reason: 'Choose a handle.' };
  }
  if (handle.length < 3 || handle.length > 32) {
    return { ok: false, reason: 'A handle must be 3 to 32 characters long.' };
  }
  if (!/^[a-z][a-z0-9_-]*$/.test(handle)) {
    return {
      ok: false,
      reason: 'Use only letters, numbers, "_" and "-", starting with a letter.',
    };
  }
  if (reserved.has(handle)) {
    return { ok: false, reason: 'That handle is reserved. Choose another.' };
  }
  return { ok: true, handle };
}
