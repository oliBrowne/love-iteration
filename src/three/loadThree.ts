// three.js is only ever imported here, through a dynamic import, so Vite puts it in its own
// chunk. The home page and ASCII pieces never download it; a three.js piece calls loadThree().
type ThreeModule = typeof import('three');

let pending: Promise<ThreeModule> | undefined;

export function loadThree(): Promise<ThreeModule> {
  pending ??= import('three').catch((error: unknown) => {
    pending = undefined; // allow a retry after a failed (e.g. offline) load
    throw error;
  });
  return pending;
}
