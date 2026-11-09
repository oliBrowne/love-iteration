import { createHash, randomBytes } from 'node:crypto';

// A session lasts 7 days from login.
export const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;

export type SessionStore = {
  // Starts a session for an account and returns its secret token.
  create(accountId: string): string;
  // Returns the account for a live token, or undefined.
  find(token: string): string | undefined;
  // Ends a session. Unknown tokens are ignored.
  revoke(token: string): void;
};

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Keeps sessions in memory, so they end when the server restarts. Only a hash
// of each token is kept; a later step can store the same hashes in the
// database behind this same interface.
export function createMemorySessionStore(
  now: () => number = Date.now,
): SessionStore {
  const sessions = new Map<string, { accountId: string; expiresAt: number }>();
  return {
    create(accountId) {
      const token = randomBytes(32).toString('base64url');
      sessions.set(hashToken(token), {
        accountId,
        expiresAt: now() + sessionLifetimeMs,
      });
      return token;
    },
    find(token) {
      const key = hashToken(token);
      const session = sessions.get(key);
      if (!session) return undefined;
      if (session.expiresAt <= now()) {
        sessions.delete(key);
        return undefined;
      }
      return session.accountId;
    },
    revoke(token) {
      sessions.delete(hashToken(token));
    },
  };
}
