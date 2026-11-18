import { useEffect, useState } from 'react';

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

/** The piece id in the current address, kept up to date as it changes. */
export function usePieceId(): string | undefined {
  const [id, setId] = useState(() => parsePieceId(window.location.hash));
  useEffect(() => {
    const onChange = () => setId(parsePieceId(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return id;
}
