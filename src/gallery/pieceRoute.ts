/** Reads the piece id from an address like `#/piece/paper-boat`; undefined for anything else. */
export function parsePieceId(hash: string): string | undefined {
  const match = /^#\/piece\/([^/?#]+)\/?$/.exec(hash);
  if (!match?.[1]) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return undefined;
  }
}

export const galleryHash = '#/';
