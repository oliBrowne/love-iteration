// Limits repeated failed logins. Failures are counted per key (the handle and
// the client address are each a key) inside a fixed window; a key with too
// many failures is blocked until its window ends. A success clears the handle.
// Unknown handles are counted the same way, so blocking reveals nothing about
// which accounts exist. Counts live in memory only.
export type LoginThrottle = {
  isBlocked(keys: readonly string[]): boolean;
  recordFailure(keys: readonly string[]): void;
  clear(key: string): void;
};

export function createLoginThrottle(
  options: { limit?: number; windowMs?: number; now?: () => number } = {},
): LoginThrottle {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 15 * 60 * 1000;
  const now = options.now ?? Date.now;
  const failures = new Map<string, { start: number; count: number }>();
  const live = (key: string) => {
    const entry = failures.get(key);
    if (entry === undefined) return undefined;
    if (now() - entry.start >= windowMs) {
      failures.delete(key);
      return undefined;
    }
    return entry;
  };
  return {
    isBlocked: (keys) => keys.some((key) => (live(key)?.count ?? 0) >= limit),
    recordFailure(keys) {
      for (const key of keys) {
        const entry = live(key);
        if (entry) entry.count += 1;
        else failures.set(key, { start: now(), count: 1 });
      }
    },
    clear: (key) => void failures.delete(key),
  };
}
