import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Db } from './db.ts';

// An invite lasts 7 days unless a later step changes the rule.
export const inviteLifetimeMs = 7 * 24 * 60 * 60 * 1000;

export type CreatedInvite = { id: string; link: string; expiresAt: string };

// Only a hash of the token is stored, so a copy of the database cannot be used
// to join a space.
export function hashInviteToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Creates a one-time invite for a space and returns its link. Only the owner
// of the space may do this; anyone else gets 'not_owner' (also for a space
// that does not exist, so a stranger learns nothing about it). The secret
// token appears in the returned link only and is never stored.
export function createInvite(
  db: Db,
  accountId: string,
  spaceId: string,
  now: () => number = Date.now,
): CreatedInvite | 'not_owner' {
  const owner = db
    .prepare(
      "SELECT 1 FROM memberships WHERE space_id = ? AND account_id = ? AND role = 'owner'",
    )
    .get(spaceId, accountId);
  if (!owner) return 'not_owner';
  const id = randomUUID();
  const token = randomBytes(32).toString('base64url');
  const created = new Date(now()).toISOString();
  const expiresAt = new Date(now() + inviteLifetimeMs).toISOString();
  db.prepare(
    `INSERT INTO invites (id, space_id, created_by, token_hash, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, spaceId, accountId, hashInviteToken(token), created, expiresAt);
  return { id, link: `/invite/${token}`, expiresAt };
}
