// A small fixed-window rate limiter. Each key (such as a client address) may
// make `limit` requests per window; the next one is refused until the window
// ends. Counts live in memory only and are never written anywhere.
export type RateLimiter = (key: string) => boolean;

export function createRateLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const now = options.now ?? Date.now;
  const windows = new Map<string, { start: number; count: number }>();
  return (key) => {
    const time = now();
    const current = windows.get(key);
    if (current === undefined || time - current.start >= options.windowMs) {
      windows.set(key, { start: time, count: 1 });
      return true;
    }
    current.count += 1;
    return current.count <= options.limit;
  };
}
